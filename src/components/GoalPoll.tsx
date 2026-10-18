import React, { useState, useEffect, useMemo } from 'react';
import { GOAL_POLL_ITEMS } from '../data/messi-data';
import { calculatePollPercentages, recordPollVote } from '../utils/stats-calculator';
import { CheckCircle2, Trophy, Flame, BarChart2, Sparkles, RotateCcw, Play, ExternalLink } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GoalPollProps {
  onOpenGoalTactical?: (goalId: string) => void;
}

export const GoalPoll: React.FC<GoalPollProps> = ({ onOpenGoalTactical }) => {
  // Initialize votes from initial data + localStorage
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const baseVotes: Record<string, number> = {};
    GOAL_POLL_ITEMS.forEach((item) => {
      baseVotes[item.id] = item.initialVotes;
    });
    return baseVotes;
  });

  const [userVote, setUserVote] = useState<string | null>(() => {
    try {
      return localStorage.getItem('messi_fan_goal_vote');
    } catch {
      return null;
    }
  });

  const [activePreviewId, setActivePreviewId] = useState<string>(GOAL_POLL_ITEMS[0].id);

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
    soundFx.playBallKick();
    const updated = recordPollVote(votes, goalId, userVote);
    setVotes(updated);
    setUserVote(goalId);
    setActivePreviewId(goalId);

    try {
      localStorage.setItem('messi_fan_goal_vote', goalId);
    } catch {
      // LocalStorage not available
    }

    // Celebratory effect
    soundFx.playCelebrationChime();
    try {
      confetti({
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
    const updated = { ...votes };
    if (updated[userVote]) {
      updated[userVote] = Math.max(0, updated[userVote] - 1);
    }
    setVotes(updated);
    setUserVote(null);
    try {
      localStorage.removeItem('messi_fan_goal_vote');
    } catch {
      // Fallback
    }
  };

  const previewGoal = GOAL_POLL_ITEMS.find((g) => g.id === activePreviewId) || GOAL_POLL_ITEMS[0];

  return (
    <div className="bg-[#080d17] rounded-xl border border-slate-800/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden my-16">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
            <Flame className="w-4 h-4 text-amber-400 inline" />
            <span>Global Fan Verdict · Live Poll</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-prestige text-white tracking-tight">
            The Greatest Messi Goal in History
          </h3>
          <p className="mt-1 text-slate-400 text-sm font-light">
            Cast your ballot. From the 55-meter Ankara sprint to the Lusail World Cup Final masterpiece.
          </p>
        </div>

        {/* Live Total Ticker */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800 self-start md:self-auto font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Total Votes Cast</span>
            <span className="text-white font-bold text-sm">{totalVotes.toLocaleString()}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Your Status</span>
            <span className={`font-bold ${userVote ? 'text-emerald-400' : 'text-amber-400'}`}>
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
                className={`group relative overflow-hidden rounded-lg border transition-all ${
                  isUserChoice
                    ? 'bg-gradient-to-r from-amber-950/20 via-[#0d1624] to-[#090e18] border-amber-400 shadow-lg shadow-amber-500/10'
                    : isLeader
                    ? 'bg-[#090f1a] border-amber-400/50 hover:border-amber-400'
                    : 'bg-[#090e18] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Background animated vote percentage fill bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out ${
                    isUserChoice
                      ? 'bg-amber-400/15'
                      : isLeader
                      ? 'bg-amber-400/10'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ width: `${pct}%` }}
                />

                {/* Card interactive content */}
                <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {/* Metadata line */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                      <span className="text-amber-400 font-semibold">{item.year}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-300">{item.competition}</span>
                      {isLeader && (
                        <span className="ml-1 text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1 font-bold">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>Current Leader</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-serif-prestige text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Percentage & Vote Action */}
                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <div className="text-lg sm:text-xl font-bold font-serif-prestige text-white">
                        {pct}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {count.toLocaleString()} votes
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVote(item.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                        isUserChoice
                          ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
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
            <div className="flex justify-between items-center pt-3 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Your vote is counted and saved locally.
              </span>
              <button
                type="button"
                onClick={handleResetVote}
                className="text-slate-400 hover:text-white flex items-center gap-1 underline transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Change My Vote
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Goal Spotlight Preview (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0f19] p-6 rounded-lg border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Goal Spotlight
            </span>
            <span className="text-xs font-mono text-slate-400">{previewGoal.badge}</span>
          </div>

          <div>
            <span className="text-xs font-mono text-sky-400 block mb-1">
              {previewGoal.match}
            </span>
            <h4 className="text-xl font-bold font-serif-prestige text-white">
              {previewGoal.title}
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed font-light">
              {previewGoal.description}
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Distance / Geometry:</span>
              <span className="text-amber-400 font-bold">{previewGoal.distance}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Global Vote Share:</span>
              <span className="text-white font-bold">{percentages[previewGoal.id] || 0}%</span>
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect on Tactical Pitch Canvas</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
