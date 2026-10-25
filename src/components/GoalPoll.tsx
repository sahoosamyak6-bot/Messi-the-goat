import React, { useState, useEffect, useMemo } from 'react';
import { GOAL_POLL_ITEMS } from '../data/messi-data';
import { calculatePollPercentages, getLocalPollResults } from '../utils/stats-calculator';
import { CheckCircle2, Trophy, Flame, BarChart2, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GoalPollProps {
  onOpenGoalTactical?: (goalId: string) => void;
}

const STORAGE_KEY = 'messi_fan_goal_vote';
const BASE_VOTES = Object.fromEntries(GOAL_POLL_ITEMS.map((item) => [item.id, item.initialVotes]));

function validChoice(value: string | null): string | null {
  return value && Object.hasOwn(BASE_VOTES, value) ? value : null;
}

function readSavedChoice() {
  try {
    return { userVote: validChoice(localStorage.getItem(STORAGE_KEY)), canPersist: true };
  } catch {
    return { userVote: null, canPersist: false };
  }
}

export const GoalPoll: React.FC<GoalPollProps> = ({ onOpenGoalTactical }) => {
  const [{ userVote, canPersist }, setPollState] = useState(readSavedChoice);
  const [activePreviewId, setActivePreviewId] = useState<string>(userVote || GOAL_POLL_ITEMS[0].id);

  // Counts are derived, never incrementally mutated: reload, switch, and reset
  // always mean the illustrative baseline plus at most this device's one vote.
  const votes = useMemo(() => getLocalPollResults(BASE_VOTES, userVote), [userVote]);

  useEffect(() => {
    const syncSavedChoice = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        // Browsers may deny the storage getter itself, even after mounting.
        if (event.storageArea !== localStorage) return;
        setPollState({ userVote: validChoice(event.newValue), canPersist: true });
      } catch {
        setPollState((current) => ({ ...current, canPersist: false }));
      }
    };
    window.addEventListener('storage', syncSavedChoice);
    return () => window.removeEventListener('storage', syncSavedChoice);
  }, []);

  const saveChoice = (choice: string | null) => {
    let saved = true;
    try {
      if (choice) localStorage.setItem(STORAGE_KEY, choice);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      saved = false;
    }
    setPollState({ userVote: choice, canPersist: saved });
  };

  // Compute percentages
  const percentages = useMemo(() => {
    return calculatePollPercentages(votes);
  }, [votes]);

  // Compute total votes
  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((sum, v) => sum + v, 0);
  }, [votes]);

  // Find current leader
  const leaderId = useMemo(() => {
    let max = -1;
    let maxId = GOAL_POLL_ITEMS[0].id;
    for (const [id, count] of Object.entries(votes)) {
      if (count > max) {
        max = count;
        maxId = id;
      }
    }
    return maxId;
  }, [votes]);

  const handleVote = (goalId: string) => {
    if (!validChoice(goalId) || goalId === userVote) return;
    soundFx.playBallKick();
    saveChoice(goalId);
    setActivePreviewId(goalId);

    // Celebratory effect
    soundFx.playCelebrationChime();
    try {
      confetti({
        disableForReducedMotion: true,
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#75aadb', '#facc15', '#ffffff'],
      });
    } catch {
      // Fallback
    }
  };

  const handleResetVote = () => {
    if (!userVote) return;
    soundFx.playClickTone();
    saveChoice(null);
  };

  const previewGoal = GOAL_POLL_ITEMS.find((g) => g.id === activePreviewId) || GOAL_POLL_ITEMS[0];

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-xl shadow-sky-900/5 relative overflow-hidden my-16">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#154284] mb-2">
            <Flame className="w-4 h-4 text-[#154284] inline" />
            <span>Fan Goal Vote · Local Demo</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-950 tracking-tight">
            The Greatest Messi Goal in History
          </h3>
          <p className="mt-1 text-slate-600 text-sm font-normal">
            Choose your favorite goal. Counts start from illustrative sample votes, plus your choice on this device. This is not a live global poll.
          </p>
        </div>

        {/* Illustrative Total Ticker */}
        <div className="flex items-center gap-4 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-100 self-start md:self-auto font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Demo Vote Total</span>
            <span className="text-slate-950 font-bold text-sm">{totalVotes.toLocaleString()}</span>
          </div>
          <div className="h-6 w-px bg-sky-100" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Your Status</span>
            <span className={`font-bold ${userVote ? 'text-emerald-700' : 'text-[#154284]'}`}>
              {userVote ? 'Voted' : 'Not Voted'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Poll Options & Spotlight Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Poll Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {GOAL_POLL_ITEMS.map((item) => {
            const isUserChoice = userVote === item.id;
            const isLeader = leaderId === item.id;
            const pct = percentages[item.id] || 0;
            const count = votes[item.id] || 0;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActivePreviewId(item.id)}
                onFocus={() => setActivePreviewId(item.id)}
                className={`group relative overflow-hidden rounded-2xl border transition-all ${
                  isUserChoice
                    ? 'bg-gradient-to-r from-sky-100/70 via-sky-50 to-white border-sky-400 shadow-lg shadow-sky-900/5 shadow-sky-900/5'
                    : isLeader
                    ? 'bg-sky-50 border-sky-400 hover:border-sky-400'
                    : 'bg-white border-sky-100 hover:border-sky-200'
                }`}
              >
                {/* Background animated vote percentage fill bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out ${
                    isUserChoice
                      ? 'bg-sky-100/70'
                      : isLeader
                      ? 'bg-sky-50'
                      : 'bg-sky-50/80'
                  }`}
                  style={{ width: `${pct}%` }}
                />

                {/* Card interactive content */}
                <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {/* Metadata line */}
                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-slate-600 mb-1">
                      <span className="text-[#154284] font-semibold">{item.year}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-600">{item.competition}</span>
                      {isLeader && (
                        <span className="ml-1 text-[10px] text-[#154284] bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200 flex items-center gap-1 font-bold">
                          <Trophy className="w-3 h-3 text-[#154284]" />
                          <span>Current Leader</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-sans text-slate-950 group-hover:text-[#154284] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Percentage & Vote Action */}
                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <div className="text-lg sm:text-xl font-bold font-sans text-slate-950">
                        {pct}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {count.toLocaleString()} votes
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVote(item.id)}
                      aria-pressed={isUserChoice}
                      aria-label={`${isUserChoice ? 'Your vote:' : 'Vote for'} ${item.title}`}
                      aria-disabled={isUserChoice}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                        isUserChoice
                          ? 'bg-[#154284] text-white shadow-md shadow-sky-900/5 font-bold'
                          : 'bg-sky-100 hover:bg-sky-100 text-slate-800 border border-sky-200'
                      }`}
                    >
                      {isUserChoice ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Your Vote</span>
                        </>
                      ) : (
                        <span>Vote</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reset / Change Vote option */}
          {userVote && (
            <div className="flex flex-wrap gap-3 justify-between items-center pt-3 text-xs font-mono text-slate-600" role="status">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {canPersist ? 'Your choice is saved on this device.' : 'Your choice is counted for this visit. Browser storage is unavailable.'}
              </span>
              <button
                type="button"
                onClick={handleResetVote}
                className="text-slate-600 hover:text-slate-950 flex items-center gap-1 underline transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear My Vote
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Goal Spotlight Preview (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#154284] font-semibold">
              Goal Spotlight
            </span>
            <span className="text-xs font-mono text-slate-600">{previewGoal.badge}</span>
          </div>

          <div>
            <span className="text-xs font-mono text-sky-700 block mb-1">
              {previewGoal.match}
            </span>
            <h4 className="text-xl font-bold font-sans text-slate-950">
              {previewGoal.title}
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
              {previewGoal.description}
            </p>
          </div>

          <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Distance / Geometry:</span>
              <span className="text-[#154284] font-bold">{previewGoal.distance}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Demo Vote Share:</span>
              <span className="text-slate-950 font-bold">{percentages[previewGoal.id] || 0}%</span>
            </div>
          </div>

          {/* Direct CTA to Tactical Pitch Visualizer */}
          <div className="pt-2">
            <a
              href="#pitch-visualizer"
              onClick={() => {
                soundFx.playClickTone();
                if (onOpenGoalTactical) onOpenGoalTactical(previewGoal.id);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-100 hover:bg-sky-100 text-slate-800 text-xs font-semibold rounded-lg border border-sky-200 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#154284]" />
              <span>Inspect on Tactical Pitch Canvas</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
