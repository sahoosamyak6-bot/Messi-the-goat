import React, { useState, useEffect } from 'react';
import { ICONIC_GOALS_TACTICAL } from '../data/messi-data';
import { IconicGoal } from '../types/messi';
import { Play, Pause, RotateCcw, Volume2, Shield, Activity, Award, Compass, Share2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PitchVisualizerProps {
  onShareSection?: () => void;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ onShareSection }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(ICONIC_GOALS_TACTICAL[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(100); // 0 to 100

  const activeGoal = ICONIC_GOALS_TACTICAL.find((g) => g.id === selectedGoalId) || ICONIC_GOALS_TACTICAL[0];

  // Play animation loop
  useEffect(() => {
    let animId: number;
    let start: number | null = null;
    const duration = 3000; // 3 seconds

    if (isPlaying) {
      soundFx.playBallKick();
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min(((timestamp - start) / duration) * 100, 100);
        setPlaybackProgress(progress);

        if (progress < 100) {
          animId = requestAnimationFrame(step);
        } else {
          setIsPlaying(false);
          soundFx.playCelebrationChime();
        }
      };
      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  const handleSelectGoal = (id: string) => {
    soundFx.playClickTone();
    setSelectedGoalId(id);
    setPlaybackProgress(100);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setPlaybackProgress(0);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    soundFx.playClickTone();
    setIsPlaying(false);
    setPlaybackProgress(100);
  };

  // Trajectory points
  const { startX, startY, dribblePoints, shotTarget } = activeGoal.pitchTrajectory;
  const allPathPoints = [
    { x: startX, y: startY },
    ...dribblePoints.map((p) => ({ x: p.x, y: p.y })),
    shotTarget,
  ];

  // SVG coordinate conversions (pitch: width 800, height 520)
  const toSvgX = (pct: number) => (pct / 100) * 760 + 20;
  const toSvgY = (pct: number) => (pct / 100) * 480 + 20;

  // Build SVG path string
  const svgPathD = allPathPoints.reduce((acc, pt, i) => {
    const x = toSvgX(pt.x);
    const y = toSvgY(pt.y);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Calculate position along path based on progress
  const currentPointIndex = Math.min(
    Math.floor((playbackProgress / 100) * (allPathPoints.length - 1)),
    allPathPoints.length - 1
  );
  const currentPt = allPathPoints[currentPointIndex];

  return (
    <section id="pitch-visualizer" className="py-20 bg-[#060a12] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
              <Compass className="w-4 h-4 text-amber-400 inline" />
              <span>Interactive Tactical Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
              The Pitch Visualizer
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              Examine the geometry, dribble trajectories, defender displacements, and terminal strike velocities of Lionel Messi&rsquo;s most celebrated goals.
            </p>
          </div>

          {onShareSection && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onShareSection();
              }}
              className="self-start md:self-end flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0d1424] hover:bg-[#121c32] border border-slate-700/80 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Share Pitch Visualizer & Goal Lab link"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Share Goal Lab</span>
            </button>
          )}
        </div>

        {/* Goal Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {ICONIC_GOALS_TACTICAL.map((g) => {
            const isSelected = g.id === selectedGoalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGoal(g.id)}
                className={`px-4 py-2 text-xs font-semibold rounded whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-[#0a0f19] text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
                }`}
              >
                {g.title} ({g.minute})
              </button>
            );
          })}
        </div>

        {/* Main Tactical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tactical Pitch Canvas SVG (8 Cols) */}
          <div className="lg:col-span-8 bg-[#090e18] p-5 rounded-lg border border-slate-800 shadow-sm">
            {/* Pitch Header & Controls */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400">
                  {activeGoal.competition} · vs {activeGoal.opponent} ({activeGoal.date})
                </span>
                <h3 className="text-xl font-bold font-serif-prestige text-white">
                  {activeGoal.title}
                </h3>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Run</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset simulation"
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pitch SVG */}
            <div className="relative w-full aspect-[8/5] bg-gradient-to-br from-[#0e2417] via-[#0c1f14] to-[#08150e] rounded border border-emerald-900/60 overflow-hidden shadow-inner">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full select-none"
                aria-label="Tactical football pitch diagram"
              >
                {/* Grass mowing stripes */}
                <g opacity="0.08">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <rect key={i} x={i * 80} y="0" width="40" height="500" fill="#ffffff" />
                  ))}
                </g>

                {/* Pitch Outlines */}
                <rect x="20" y="20" width="760" height="460" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                {/* Halfway line */}
                <line x1="400" y1="20" x2="400" y2="480" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                {/* Center circle */}
                <circle cx="400" cy="250" r="60" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <circle cx="400" cy="250" r="3" fill="#22c55e" opacity="0.8" />

                {/* Left Penalty Box (Defensive) */}
                <rect x="20" y="110" width="130" height="260" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
                <rect x="20" y="175" width="45" height="130" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />

                {/* Right Penalty Box (Attacking Goal Target) */}
                <rect x="650" y="110" width="130" height="260" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
                <rect x="735" y="175" width="45" height="130" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
                {/* Right Penalty Spot & D */}
                <circle cx="695" cy="250" r="3" fill="#22c55e" opacity="0.9" />
                <path d="M 650 205 A 60 60 0 0 1 650 295" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />

                {/* Goal Frame Right */}
                <rect x="780" y="215" width="14" height="70" fill="rgba(255,255,255,0.08)" stroke="#f8fafc" strokeWidth="2" />

                {/* Attacking Direction Arrow */}
                <g opacity="0.2">
                  <path d="M 370 470 L 430 470 L 420 465 M 430 470 L 420 475" stroke="#f8fafc" strokeWidth="2" fill="none" />
                  <text x="400" y="460" textAnchor="middle" fill="#f8fafc" fontSize="10" fontFamily="monospace">
                    ATTACKING DIRECTION &rarr;
                  </text>
                </g>

                {/* Animated Trajectory Path */}
                <path
                  d={svgPathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />

                {/* Dribble Waypoints */}
                {activeGoal.pitchTrajectory.dribblePoints.map((pt, i) => {
                  const px = toSvgX(pt.x);
                  const py = toSvgY(pt.y);
                  return (
                    <g key={i}>
                      <circle cx={px} cy={py} r="5" fill="#f59e0b" opacity="0.9" />
                      {pt.label && (
                        <text
                          x={px}
                          y={py - 10}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="10"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          className="drop-shadow"
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Start Position Marker */}
                <circle cx={toSvgX(startX)} cy={toSvgY(startY)} r="8" fill="#38bdf8" />
                <text x={toSvgX(startX)} y={toSvgY(startY) + 18} textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  START
                </text>

                {/* Shot Target Goal Marker */}
                <circle cx={toSvgX(shotTarget.x)} cy={toSvgY(shotTarget.y)} r="9" fill="#e11d48" className="animate-pulse" />
                <text x={toSvgX(shotTarget.x) - 18} y={toSvgY(shotTarget.y) - 12} textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">
                  GOAL!
                </text>

                {/* Current Messi Position (Animated) */}
                <g transform={`translate(${toSvgX(currentPt.x)}, ${toSvgY(currentPt.y)})`}>
                  <circle r="12" fill="rgba(245, 158, 11, 0.3)" className="animate-ping" />
                  <circle r="8" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                  <text y="3" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">10</text>
                </g>
              </svg>
            </div>

            {/* Tactical Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="bg-[#0b121e] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">Distance:</span>
                <span className="text-amber-400 font-bold text-sm">{activeGoal.distanceMeters} Meters</span>
              </div>
              <div className="bg-[#0b121e] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">Top Speed:</span>
                <span className="text-sky-400 font-bold text-sm">{activeGoal.speedKmh ? `${activeGoal.speedKmh} km/h` : 'Agile Feint'}</span>
              </div>
              <div className="bg-[#0b121e] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">Execution Minute:</span>
                <span className="text-slate-200 font-bold text-sm">{activeGoal.minute}</span>
              </div>
              <div className="bg-[#0b121e] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">Goal Type:</span>
                <span className="text-emerald-400 font-bold text-sm">{activeGoal.type}</span>
              </div>
            </div>
          </div>

          {/* Tactical Commentary & Historical Significance (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Broadcast Quote Card */}
            <div className="bg-[#0b121e] p-6 rounded-lg border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
                <Volume2 className="w-3.5 h-3.5" />
                Live Broadcast Call
              </div>
              <blockquote className="text-sm italic text-slate-200 leading-relaxed font-light">
                &ldquo;{activeGoal.commentarySnippet}&rdquo;
              </blockquote>
              <div className="mt-2 text-xs font-mono text-slate-400">
                — {activeGoal.commentator}
              </div>
            </div>

            {/* Tactical Breakdown Card */}
            <div className="bg-[#090e18] p-6 rounded-lg border border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                Tactical Breakdown
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {activeGoal.context}
              </p>
              <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-[11px] font-mono text-amber-400 font-semibold block mb-1">
                  Historical Significance:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeGoal.significance}
                </p>
              </div>
            </div>

            {/* Signature Playing Style Insights */}
            <div className="bg-[#080d16] p-5 rounded-lg border border-slate-800 text-xs">
              <h4 className="font-mono uppercase tracking-widest text-slate-400 mb-2">
                The Messi Geometry
              </h4>
              <p className="text-slate-400 leading-relaxed font-light">
                Unlike traditional wingers who rely on pure top-end linear speed, Messi manipulates defenders through micro-deceleration (pausing mid-stride) and a low center of gravity, shifting body orientation in 0.25 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
