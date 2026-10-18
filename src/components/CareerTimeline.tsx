import React, { useState, useRef, useEffect } from 'react';
import { TIMELINE_YEAR_ITEMS } from '../data/messi-data';
import { TimelineYearItem } from '../types/messi';
import {
  Calendar,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote,
  Target,
  Compass,
  ArrowRight,
  Shield,
  Star,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CareerTimelineProps {
  onSyncSeasonFilter?: (seasonLabel: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({
  onSyncSeasonFilter,
  onNavigateToSection,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2022); // Default to World Cup year 2022
  const [activeEraFilter, setActiveEraFilter] = useState<'all' | 'Barcelona' | 'Paris' | 'Miami'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedItem: TimelineYearItem =
    TIMELINE_YEAR_ITEMS.find((item) => item.year === selectedYear) || TIMELINE_YEAR_ITEMS[18];

  const filteredYears = TIMELINE_YEAR_ITEMS.filter((item) => {
    if (activeEraFilter === 'all') return true;
    if (activeEraFilter === 'Barcelona') return item.club === 'FC Barcelona';
    if (activeEraFilter === 'Paris') return item.club === 'Paris Saint-Germain';
    if (activeEraFilter === 'Miami') return item.club === 'Inter Miami CF';
    return true;
  });

  const handleSelectYear = (year: number) => {
    soundFx.playClickTone();
    setSelectedYear(year);
  };

  const handlePrevYear = () => {
    const currentIndex = TIMELINE_YEAR_ITEMS.findIndex((item) => item.year === selectedYear);
    if (currentIndex > 0) {
      soundFx.playClickTone();
      setSelectedYear(TIMELINE_YEAR_ITEMS[currentIndex - 1].year);
    }
  };

  const handleNextYear = () => {
    const currentIndex = TIMELINE_YEAR_ITEMS.findIndex((item) => item.year === selectedYear);
    if (currentIndex < TIMELINE_YEAR_ITEMS.length - 1) {
      soundFx.playClickTone();
      setSelectedYear(TIMELINE_YEAR_ITEMS[currentIndex + 1].year);
    }
  };

  // Auto-scroll selected year button into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(`[data-year="${selectedYear}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedYear]);

  return (
    <section id="career-timeline" className="py-20 bg-[#060911] border-b border-slate-800/80 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[350px] bg-sky-950/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
              <Calendar className="w-4 h-4 text-amber-400 inline" />
              <span>Interactive Chronology · 2004 – 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
              The Career Timeline
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg font-light max-w-2xl leading-relaxed">
              Click any year across Messi&rsquo;s 21-season professional journey to instantly inspect matching biography chapters, official match records, and trophy captures.
            </p>
          </div>

          {/* Quick Era Filter Segmented Controls */}
          <div className="flex items-center gap-1.5 bg-[#090e18] p-1.5 rounded-lg border border-slate-800 self-start md:self-end">
            {[
              { id: 'all', label: 'All 21 Years' },
              { id: 'Barcelona', label: 'Barcelona (04–21)' },
              { id: 'Paris', label: 'PSG (21–23)' },
              { id: 'Miami', label: 'Miami (23–25)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setActiveEraFilter(tab.id as typeof activeEraFilter);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeEraFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Rail Slider with Horizontal Scroll */}
        <div className="relative mb-10 bg-[#090e18] p-3 rounded-xl border border-slate-800/80 shadow-inner">
          {/* Timeline track navigation arrows */}
          <div className="flex items-center justify-between mb-2 px-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Drag or click years to navigate</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevYear}
                disabled={selectedYear === TIMELINE_YEAR_ITEMS[0].year}
                aria-label="Previous season"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-amber-400">{selectedYear}</span>
              <button
                type="button"
                onClick={handleNextYear}
                disabled={selectedYear === TIMELINE_YEAR_ITEMS[TIMELINE_YEAR_ITEMS.length - 1].year}
                aria-label="Next season"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Year Buttons */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto py-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredYears.map((item) => {
              const isSelected = item.year === selectedYear;
              return (
                <button
                  key={item.year}
                  data-year={item.year}
                  type="button"
                  onClick={() => handleSelectYear(item.year)}
                  className={`group relative shrink-0 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[82px] py-2.5 px-2 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-[#0a0f1a] hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Major peak star badge */}
                  {item.isMajorPeak && (
                    <span className="absolute -top-1.5 -right-1 text-[10px] text-amber-300 bg-amber-950/80 px-1 rounded-full border border-amber-400/40 font-mono">
                      ★
                    </span>
                  )}

                  <span
                    className={`text-sm sm:text-base font-bold font-serif-prestige tracking-tight ${
                      isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {item.year}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {item.seasonLabel}
                  </span>

                  {/* Club indicator dot */}
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                      item.club === 'FC Barcelona'
                        ? 'bg-red-500'
                        : item.club === 'Paris Saint-Germain'
                        ? 'bg-blue-400'
                        : 'bg-pink-400'
                    }`}
                    title={item.club}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Year Spotlight Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#090e18] p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl">
          {/* Left Column: Biography & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* Season Metadata Header */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <span className="text-amber-400 font-semibold">{selectedItem.seasonLabel} Campaign</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-300">{selectedItem.club}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{selectedItem.eraBadge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-prestige text-white leading-tight">
                {selectedItem.milestoneTitle}
              </h3>

              <p className="mt-2 text-sm text-sky-400 font-light italic">
                {selectedItem.shortSummary}
              </p>
            </div>

            {/* In-depth Narrative */}
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3 font-normal">
              <p>{selectedItem.detailedBio}</p>
            </div>

            {/* Defining Moment Box */}
            <div className="p-4 bg-slate-950/80 rounded-lg border-l-2 border-l-amber-400 border border-slate-800/80">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                Defining Moment of the Season
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedItem.definingMoment}
              </p>
            </div>

            {/* Season Quote */}
            {selectedItem.quote && (
              <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800/80 flex gap-3">
                <Quote className="w-5 h-5 text-amber-400/80 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm italic text-slate-300">
                    &ldquo;{selectedItem.quote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs font-mono text-amber-400">
                    — {selectedItem.quote.speaker}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Statistics & Silverware (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Year Stats Grid */}
            <div className="bg-[#0b121e] p-6 rounded-lg border border-slate-800/90 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {selectedItem.seasonLabel} Official Statistics
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {selectedItem.stats.ga} Goal Contributions
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">Matches</span>
                  <span className="text-2xl font-bold font-serif-prestige text-slate-100 mt-1 block">
                    {selectedItem.stats.apps}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">Goals</span>
                  <span className="text-2xl font-bold font-serif-prestige text-amber-400 mt-1 block">
                    {selectedItem.stats.goals}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {selectedItem.stats.gpg} / gm
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">Assists</span>
                  <span className="text-2xl font-bold font-serif-prestige text-sky-400 mt-1 block">
                    {selectedItem.stats.assists}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {selectedItem.stats.apg} / gm
                  </span>
                </div>
              </div>

              {/* Trophies & Honors won in this period */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Silverware & Honors in {selectedItem.year}
                </span>

                {selectedItem.trophiesWon.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedItem.trophiesWon.map((t, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 px-3 py-2 rounded border border-slate-800"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium">{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    No major team trophies won in this transition period.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action: Cross-link to Career Stats & Biography */}
            <div className="bg-[#0a0f19] p-5 rounded-lg border border-slate-800/80 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
                Synchronized Navigation
              </span>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  if (onSyncSeasonFilter) onSyncSeasonFilter(selectedItem.seasonLabel);
                  if (onNavigateToSection) onNavigateToSection('statistics');
                }}
                className="w-full flex items-center justify-between p-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
              >
                <span>Filter Career Stats Table to {selectedItem.seasonLabel}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  if (onNavigateToSection) onNavigateToSection('gallery');
                }}
                className="w-full flex items-center justify-between p-3 rounded bg-slate-900 hover:bg-slate-800 text-xs font-medium text-sky-300 transition-colors border border-slate-800"
              >
                <span>View {selectedItem.year} Iconic Match Clips</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
