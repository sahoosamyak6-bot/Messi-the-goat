import React from 'react';
import { Trophy, Award, Target, Compass, ChevronDown, Flame, Play, Calendar } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenHighlightModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenHighlightModal }) => {
  const statsOverview = [
    {
      label: 'Official Career Goals',
      value: '849+',
      sub: 'Senior Club & Country Matches',
      icon: Target,
      accent: 'text-amber-400',
    },
    {
      label: 'Career Assists',
      value: '378+',
      sub: 'All-time Playmaking Leader',
      icon: Compass,
      accent: 'text-sky-400',
    },
    {
      label: 'Silverware Titles',
      value: '46',
      sub: 'Most Decorated Player in History',
      icon: Trophy,
      accent: 'text-amber-300',
    },
    {
      label: 'Ballon d’Or Awards',
      value: '8',
      sub: 'Unbroken World Record (2009–2023)',
      icon: Award,
      accent: 'text-amber-400',
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
      {/* Background Ambience Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-900/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subheading Kicker */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono tracking-widest text-sky-400 uppercase mb-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>The Definitive Chronicle · 1987 – Present</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-400 hidden sm:inline">Argentina · Barcelona · Paris · Miami</span>
        </div>

        {/* Main Title */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif-prestige tracking-tight text-white uppercase leading-[1.08]">
            Lionel Andrés <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Messi</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-3xl">
            From the dusty streets of Rosario and a contract signed on a paper napkin to eight Ballons d’Or and the golden summit of Lusail. The definitive retrospective of association football’s undisputed greatest artist.
          </p>
        </div>

        {/* Primary Interactive CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onNavigate('biography');
            }}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm tracking-wide rounded transition-all shadow-lg hover:shadow-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Read Comprehensive Biography
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onNavigate('statistics');
            }}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm tracking-wide rounded border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Explore Career Statistics
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onNavigate('career-timeline');
            }}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-sm tracking-wide rounded border border-amber-400/30 hover:border-amber-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Interactive Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onNavigate('gallery');
            }}
            className="px-5 py-3 text-sky-300 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Play className="w-4 h-4 text-sky-400 fill-sky-400/20" />
            <span>Iconic Moments & Videos</span>
          </button>
        </div>

        {/* Key Career Metrics Grid (Zero-Pill Discipline) */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {statsOverview.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#0a0f19] p-5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                  <Icon className={`w-4 h-4 ${item.accent} opacity-80`} />
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold font-serif-prestige tracking-tight ${item.accent}`}>
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-slate-400 font-normal">
                  {item.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Pull Quote */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-slate-900/90 via-[#0c1322] to-slate-900/90 border border-slate-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm sm:text-base italic text-slate-200 font-light">
              &ldquo;I have seen the player who will inherit my place in Argentine football, and his name is Messi.&rdquo;
            </p>
            <p className="text-xs font-mono text-amber-400/90">
              — Diego Armando Maradona (2006)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('pitch-visualizer')}
            className="shrink-0 flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Launch Tactical Goal Lab</span>
            <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </section>
  );
};
