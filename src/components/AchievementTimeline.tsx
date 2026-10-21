import React, { useState, useMemo } from 'react';
import { ACHIEVEMENT_TIMELINE_ITEMS } from '../data/messi-data';
import { AchievementItem } from '../types/messi';
import { sortAchievementsChronologically } from '../utils/stats-calculator';
import {
  Trophy,
  Award,
  Target,
  Sparkles,
  Flame,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  ExternalLink,
  Quote,
  Calendar,
  ArrowRight,
  Star,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AchievementTimelineProps {
  onNavigate?: (sectionId: string) => void;
  onSyncSeasonFilter?: (seasonLabel: string) => void;
}

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({
  onNavigate,
  onSyncSeasonFilter,
}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'ach-world-cup-2022': true,
    'ach-46-trophies': true,
  });

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'international':
        return Target;
      case 'world_cup':
        return Trophy;
      case 'club_milestone':
        return Sparkles;
      case 'individual':
        return Award;
      case 'world_record':
        return Flame;
      default:
        return Shield;
    }
  };

  const getAccentForCategory = (category: string) => {
    switch (category) {
      case 'world_cup':
        return {
          border: 'border-amber-400',
          bg: 'bg-amber-400/10',
          text: 'text-amber-300',
          badge: 'bg-amber-950/60 border-amber-400/40 text-amber-300',
          glow: 'shadow-amber-500/10',
        };
      case 'international':
        return {
          border: 'border-sky-400',
          bg: 'bg-sky-400/10',
          text: 'text-sky-300',
          badge: 'bg-sky-950/60 border-sky-400/40 text-sky-300',
          glow: 'shadow-sky-500/10',
        };
      case 'individual':
        return {
          border: 'border-amber-300',
          bg: 'bg-amber-300/10',
          text: 'text-amber-200',
          badge: 'bg-amber-950/60 border-amber-300/40 text-amber-200',
          glow: 'shadow-amber-400/10',
        };
      case 'club_milestone':
        return {
          border: 'border-pink-400',
          bg: 'bg-pink-400/10',
          text: 'text-pink-300',
          badge: 'bg-pink-950/60 border-pink-400/40 text-pink-300',
          glow: 'shadow-pink-500/10',
        };
      default:
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-400/10',
          text: 'text-emerald-300',
          badge: 'bg-emerald-950/60 border-emerald-400/40 text-emerald-300',
          glow: 'shadow-emerald-500/10',
        };
    }
  };

  const toggleExpand = (id: string) => {
    soundFx.playClickTone();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    soundFx.playClickTone();
    const allExpanded: Record<string, boolean> = {};
    ACHIEVEMENT_TIMELINE_ITEMS.forEach((item) => {
      allExpanded[item.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const handleCollapseAll = () => {
    soundFx.playClickTone();
    setExpandedItems({});
  };

  const handleSortToggle = () => {
    soundFx.playClickTone();
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter and sort items
  const sortedItems = useMemo(() => {
    let items = sortAchievementsChronologically(ACHIEVEMENT_TIMELINE_ITEMS);

    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (sortDirection === 'desc') {
      items = [...items].reverse();
    }

    return items;
  }, [sortDirection, selectedCategory]);

  return (
    <section
      id="achievement-timeline"
      className="scroll-mt-24 py-16 sm:py-24 bg-[#060912] border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[350px] bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
              <Trophy className="w-4 h-4 text-amber-400 inline" />
              <span>Comprehensive Milestone Summary · All 6 Accomplishments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase leading-tight">
              Achievement Timeline
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base lg:text-lg font-light max-w-2xl leading-relaxed">
              A chronological vertical chronicle of Lionel Messi&rsquo;s six defining career accomplishments — from breaking international records to the World Cup crown and an unprecedented 46th trophy.
            </p>
          </div>

          {/* Quick Stats Summary Badge */}
          <div className="bg-[#0b121e] border border-slate-800 p-4 rounded-xl flex items-center gap-6 self-start md:self-end shadow-md">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider">
                Accomplishments
              </span>
              <span className="text-2xl font-bold font-serif-prestige text-amber-400">
                6 / 6
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider">
                Chronology Span
              </span>
              <span className="text-sm font-bold font-mono text-slate-200">
                2016 – 2024
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Filters, Sort, and Expand Controls */}
        <div className="bg-[#080d16] p-3 sm:p-4 rounded-xl border border-slate-800/90 shadow-inner mb-10 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All 6 Milestones' },
              { id: 'world_cup', label: 'World Cup' },
              { id: 'international', label: 'International' },
              { id: 'individual', label: 'Ballon d’Or' },
              { id: 'world_record', label: 'World Records' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(tab.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort & View Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleSortToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-800 transition-colors"
              title="Toggle Chronological Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>{sortDirection === 'asc' ? '2016 → 2024' : '2024 → 2016'}</span>
            </button>

            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono rounded border border-slate-800 transition-colors"
              title="Expand All Milestone Details"
            >
              Expand All
            </button>

            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono rounded border border-slate-800 transition-colors"
              title="Collapse to Concise Summaries"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Chronological Vertical List with responsive left margin */}
        <div className="relative pl-10 sm:pl-14 space-y-8 before:absolute before:left-[17px] sm:before:left-[21px] before:top-4 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-sky-400 before:to-amber-500">
          {sortedItems.map((item) => {
            const Icon = getIconForCategory(item.category);
            const styling = getAccentForCategory(item.category);
            const isExpanded = !!expandedItems[item.id];

            return (
              <div
                key={item.id}
                id={item.id}
                className="relative group transition-all"
              >
                {/* Timeline Node Marker accurately centered on the spine */}
                <div
                  className={`absolute -left-[37px] sm:-left-[45px] top-6 w-8 h-8 rounded-full bg-[#0a0f19] border-2 ${styling.border} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 z-10`}
                >
                  <Icon className={`w-4 h-4 ${styling.text}`} />
                </div>

                {/* Milestone Card */}
                <div
                  className={`bg-[#0a0f1a] rounded-xl border transition-all overflow-hidden ${
                    isExpanded
                      ? `${styling.border} shadow-xl ${styling.glow}`
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header & Summary Bar */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer select-none flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Top Metadata Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${styling.badge}`}>
                          {item.year} · {item.dateStr}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                          {item.badge}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-amber-400/90 font-mono text-[11px]">
                          Milestone #{item.order} of 6
                        </span>
                      </div>

                      {/* Accomplishment Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-serif-prestige text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Primary Verbatim Accomplishment Statement */}
                      <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                        &ldquo;{item.summary}&rdquo;
                      </p>
                    </div>

                    {/* Metric Badge & Expand Icon */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
                      <div className="bg-[#070b14] px-3.5 py-2 rounded-lg border border-slate-800/90 text-left lg:text-right font-mono">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                          {item.metrics.label}
                        </span>
                        <span className={`text-sm sm:text-base font-bold ${styling.text}`}>
                          {item.metrics.value}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label={isExpanded ? 'Collapse milestone details' : 'Expand milestone details'}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded In-depth Story & Cross-link Details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-5 animate-in fade-in duration-200">
                      {/* Deep Historical Details */}
                      <div className="text-sm text-slate-300 leading-relaxed font-normal">
                        <p>{item.details}</p>
                      </div>

                      {/* Highlight Quote if available */}
                      {item.quote && (
                        <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800/90 flex items-start gap-3">
                          <Quote className="w-5 h-5 text-amber-400/80 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm italic text-slate-200 leading-relaxed font-light">
                              &ldquo;{item.quote.text}&rdquo;
                            </p>
                            <span className="mt-1 block text-xs font-mono text-amber-400">
                              — {item.quote.author}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Contextual Cross-link Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {onSyncSeasonFilter && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playClickTone();
                              const seasonMap: Record<number, string> = {
                                2016: '2015/16',
                                2022: '2022/23',
                                2023: '2023',
                                2024: '2024',
                              };
                              onSyncSeasonFilter(seasonMap[item.year] || `${item.year}`);
                              if (onNavigate) onNavigate('statistics');
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>Inspect {item.year} Match Statistics</span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </button>
                        )}

                        {onNavigate && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playClickTone();
                              if (item.category === 'world_cup' || item.category === 'international') {
                                onNavigate('gallery');
                              } else {
                                onNavigate('trophies');
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-slate-800 text-xs font-mono transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-sky-400" />
                            <span>
                              {item.category === 'world_cup'
                                ? 'View Lusail World Cup Moments'
                                : 'Explore Trophy Details'}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Callout Note */}
        <div className="mt-14 p-6 rounded-xl bg-gradient-to-r from-slate-900/80 via-[#0a101d] to-slate-900/80 border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold font-serif-prestige text-white">
                All 6 Crown Accomplishments Verified
              </div>
              <p className="text-xs text-slate-400">
                Official FIFA, CONMEBOL, UEFA, France Football, and MLS records compiled chronologically.
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onNavigate('career-timeline');
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded font-mono transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Explore 21-Season Career Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
