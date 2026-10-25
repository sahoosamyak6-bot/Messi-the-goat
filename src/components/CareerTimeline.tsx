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
  externalSelectedYear?: number;
  externalRequestKey?: number;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({
  onSyncSeasonFilter,
  onNavigateToSection,
  externalSelectedYear,
  externalRequestKey,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(externalSelectedYear || 2022); // Default to World Cup year 2022
  const [activeEraFilter, setActiveEraFilter] = useState<'all' | 'Barcelona' | 'Paris' | 'Miami'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalSelectedYear) {
      setSelectedYear(externalSelectedYear);
    }
  }, [externalSelectedYear, externalRequestKey]);

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

  // Center the selected year inside its rail without scrolling the page.
  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeBtn = container?.querySelector<HTMLElement>(`[data-year="${selectedYear}"]`);
    if (!container || !activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeBtn.getBoundingClientRect();
    const centeredLeft = container.scrollLeft + buttonRect.left - containerRect.left
      + (buttonRect.width - container.clientWidth) / 2;

    container.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, [selectedYear, activeEraFilter]);

  return (
    <section id="career-timeline" className="archive-content scroll-mt-24 py-20 bg-sky-50/70 border-b border-sky-100 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[350px] bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-rose-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#154284] uppercase mb-3">
              <Calendar className="w-4 h-4 text-[#154284] inline" />
              <span>Interactive Chronology · 2004 – 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-950">
              The Career Timeline
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg font-normal max-w-2xl leading-relaxed">
              Click any year across Messi&rsquo;s 21-season professional journey to instantly inspect matching biography chapters, official match records, and trophy captures.
            </p>
          </div>

          {/* Quick Era Filter Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1.5 max-w-full bg-white p-1.5 rounded-2xl border border-sky-100 self-start md:self-end">
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
                aria-pressed={activeEraFilter === tab.id}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeEraFilter === tab.id
                    ? 'bg-[#154284] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Rail Slider with Horizontal Scroll */}
        <div className="relative mb-10 bg-white p-3 rounded-2xl border border-sky-100 shadow-sm shadow-sky-900/5">
          {/* Timeline track navigation arrows */}
          <div className="flex items-center justify-between mb-2 px-2 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#154284]" />
              <span>Drag or click years to navigate</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevYear}
                disabled={selectedYear === TIMELINE_YEAR_ITEMS[0].year}
                aria-label="Previous season"
                className="p-1 rounded-lg bg-sky-100 hover:bg-sky-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#154284]">{selectedYear}</span>
              <button
                type="button"
                onClick={handleNextYear}
                disabled={selectedYear === TIMELINE_YEAR_ITEMS[TIMELINE_YEAR_ITEMS.length - 1].year}
                aria-label="Next season"
                className="p-1 rounded-lg bg-sky-100 hover:bg-sky-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors"
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
                  aria-pressed={isSelected}
                  className={`group relative shrink-0 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[82px] py-2.5 px-2 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-sky-100 to-white border-sky-400 shadow-lg shadow-sky-900/5 shadow-sky-900/5'
                      : 'bg-white hover:bg-sky-100/80 border-sky-100 hover:border-sky-200'
                  }`}
                >
                  {/* Major peak star badge */}
                  {item.isMajorPeak && (
                    <span className="absolute -top-1.5 -right-1 text-[10px] text-[#154284] bg-rose-50 px-1 rounded-full border border-sky-200 font-mono">
                      ★
                    </span>
                  )}

                  <span
                    className={`text-sm sm:text-base font-bold font-sans tracking-tight ${
                      isSelected ? 'text-[#154284]' : 'text-slate-800 group-hover:text-slate-950'
                    }`}
                  >
                    {item.year}
                  </span>

                  <span className="text-[10px] font-mono text-slate-600 mt-0.5">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/5">
          {/* Left Column: Biography & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* Season Metadata Header */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 mb-2">
                <span className="text-[#154284] font-semibold">{selectedItem.seasonLabel} Campaign</span>
                <span className="text-slate-500">·</span>
                <span className="text-sky-800">{selectedItem.club}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-600">{selectedItem.eraBadge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-950 leading-tight">
                {selectedItem.milestoneTitle}
              </h3>

              <p className="mt-2 text-sm text-sky-700 font-normal italic">
                {selectedItem.shortSummary}
              </p>
            </div>

            {/* In-depth Narrative */}
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-sm text-slate-600 leading-relaxed space-y-3 font-normal">
              <p>{selectedItem.detailedBio}</p>
            </div>

            {/* Defining Moment Box */}
            <div className="p-4 bg-sky-50/80 rounded-2xl border-l-2 border-l-[#a50044] border border-sky-100">
              <span className="text-xs font-mono uppercase tracking-wider text-[#154284] font-semibold block mb-1">
                Defining Moment of the Season
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedItem.definingMoment}
              </p>
            </div>

            {/* Season Quote */}
            {selectedItem.quote && (
              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 flex gap-3">
                <Quote className="w-5 h-5 text-[#154284] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm italic text-slate-600">
                    &ldquo;{selectedItem.quote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs font-mono text-[#154284]">
                    — {selectedItem.quote.speaker}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Statistics & Silverware (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Year Stats Grid */}
            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600">
                  {selectedItem.seasonLabel} Official Statistics
                </span>
                <span className="text-xs font-mono text-[#154284] font-bold">
                  {selectedItem.stats.ga} Goal Contributions
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] font-mono uppercase text-slate-600 block">Matches</span>
                  <span className="text-2xl font-bold font-sans text-slate-950 mt-1 block">
                    {selectedItem.stats.apps}
                  </span>
                </div>
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] font-mono uppercase text-slate-600 block">Goals</span>
                  <span className="text-2xl font-bold font-sans text-[#154284] mt-1 block">
                    {selectedItem.stats.goals}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {selectedItem.stats.gpg} / gm
                  </span>
                </div>
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
                  <span className="text-[11px] font-mono uppercase text-slate-600 block">Assists</span>
                  <span className="text-2xl font-bold font-sans text-sky-700 mt-1 block">
                    {selectedItem.stats.assists}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {selectedItem.stats.apg} / gm
                  </span>
                </div>
              </div>

              {/* Trophies & Honors won in this period */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
                  <Trophy className="w-3.5 h-3.5 text-[#154284]" />
                  Silverware & Honors in {selectedItem.year}
                </span>

                {selectedItem.trophiesWon.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedItem.trophiesWon.map((t, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-800 bg-sky-50/70 px-3 py-2 rounded-lg border border-sky-100"
                      >
                        <Star className="w-3.5 h-3.5 text-[#154284] shrink-0" />
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
            <div className="bg-white p-5 rounded-2xl border border-sky-100 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-600 block">
                Synchronized Navigation
              </span>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  if (onSyncSeasonFilter) onSyncSeasonFilter(selectedItem.seasonLabel);
                  if (onNavigateToSection) onNavigateToSection('statistics');
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-sky-100 hover:bg-sky-100 text-xs font-medium text-slate-800 transition-colors border border-sky-200"
              >
                <span>Filter Career Stats Table to {selectedItem.seasonLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#154284]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  if (onNavigateToSection) onNavigateToSection('gallery');
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-xs font-medium text-sky-800 transition-colors border border-sky-100"
              >
                <span>View {selectedItem.year} Iconic Match Clips</span>
                <ArrowRight className="w-4 h-4 text-sky-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
