import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ACHIEVEMENT_TIMELINE_ITEMS } from '../data/messi-data';
import { sortAchievementsChronologically } from '../utils/stats-calculator';
import { calculateStaggerDelay, getRevealStyle } from '../utils/animation-helpers';
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
  Quote,
  Calendar,
  ArrowRight,
  Star,
  RotateCcw,
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

  // Scroll reveal & viewport entry animation state
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener?.('change', handleChange);
      return () => mediaQuery.removeEventListener?.('change', handleChange);
    }
  }, []);

  // IntersectionObserver for section entry
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsSectionInView(true);
      const allVisible: Record<string, boolean> = {};
      ACHIEVEMENT_TIMELINE_ITEMS.forEach((item) => {
        allVisible[item.id] = true;
      });
      setVisibleItems(allVisible);
      return;
    }

    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSectionInView(true);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    sectionObserver.observe(currentSection);

    // Individual item observers for progressive scroll reveal as user scrolls down
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId) {
              setVisibleItems((prev) => ({
                ...prev,
                [itemId]: true,
              }));
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    Object.values(itemRefs.current).forEach((el) => {
      if (el) itemObserver.observe(el);
    });

    return () => {
      sectionObserver.disconnect();
      itemObserver.disconnect();
    };
  }, [animationKey]);

  // Replay animation handler
  const handleReplayAnimation = () => {
    soundFx.playClickTone();
    // Temporarily reset visibility
    setVisibleItems({});
    setIsSectionInView(false);
    setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
      setIsSectionInView(true);
      // Trigger staggered reveals
      ACHIEVEMENT_TIMELINE_ITEMS.forEach((item, idx) => {
        setTimeout(() => {
          setVisibleItems((prev) => ({
            ...prev,
            [item.id]: true,
          }));
        }, calculateStaggerDelay(idx, 100, 600));
      });
    }, 50);
  };

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
          border: 'border-sky-400',
          bg: 'bg-sky-50',
          text: 'text-[#154284]',
          label: 'text-[#154284]',
          glow: 'shadow-sky-900/5',
          nodeGlow: 'shadow-[0_3px_14px_rgba(21,66,132,0.12)]',
        };
      case 'international':
        return {
          border: 'border-sky-400',
          bg: 'bg-sky-400/10',
          text: 'text-sky-800',
          label: 'text-sky-700',
          glow: 'shadow-sky-500/10',
          nodeGlow: 'shadow-[0_3px_14px_rgba(117,170,219,0.18)]',
        };
      case 'individual':
        return {
          border: 'border-blue-300',
          bg: 'bg-sky-50',
          text: 'text-blue-900',
          label: 'text-[#154284]',
          glow: 'shadow-sky-900/5',
          nodeGlow: 'shadow-[0_3px_14px_rgba(21,66,132,0.12)]',
        };
      case 'club_milestone':
        return {
          border: 'border-rose-300',
          bg: 'bg-pink-400/10',
          text: 'text-[#a50044]',
          label: 'text-[#a50044]',
          glow: 'shadow-pink-500/10',
          nodeGlow: 'shadow-[0_3px_14px_rgba(165,0,68,0.12)]',
        };
      default:
        return {
          border: 'border-emerald-300',
          bg: 'bg-emerald-400/10',
          text: 'text-emerald-800',
          label: 'text-emerald-700',
          glow: 'shadow-emerald-500/10',
          nodeGlow: 'shadow-[0_3px_14px_rgba(52,211,153,0.12)]',
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
      ref={sectionRef}
      id="achievement-timeline"
      className="archive-content scroll-mt-24 py-16 sm:py-24 bg-sky-50/70 border-b border-sky-100 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[400px] bg-sky-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[350px] bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#75aadb_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth entrance animation */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 transition-all duration-700 ease-out ${
            prefersReducedMotion || isSectionInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#154284] uppercase mb-3">
              <Trophy className="w-4 h-4 text-[#154284] inline" />
              <span>Comprehensive Milestone Summary · All 6 Accomplishments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-950 leading-tight">
              Achievement Timeline
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base lg:text-lg font-normal max-w-2xl leading-relaxed text-balance">
              A chronological vertical chronicle of Lionel Messi&rsquo;s six defining career accomplishments — from breaking international records to the World Cup crown and an unprecedented 46th trophy.
            </p>
          </div>

          {/* Quick Stats Summary Badge */}
          <div className="bg-white border border-sky-100 p-4 rounded-2xl flex items-center gap-6 self-start md:self-end shadow-md shadow-sky-900/5">
            <div>
              <span className="text-[10px] font-mono text-slate-600 uppercase block tracking-wider">
                Accomplishments
              </span>
              <span className="text-2xl font-bold font-sans text-[#154284] tabular-nums">
                6 / 6
              </span>
            </div>
            <div className="h-8 w-px bg-sky-100" />
            <div>
              <span className="text-[10px] font-mono text-slate-600 uppercase block tracking-wider">
                Chronology Span
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                2016 – 2024
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Filters, Sort, Expand Controls, and Replay Reveal */}
        <div
          className={`bg-sky-50/70 p-3 sm:p-4 rounded-2xl border border-sky-100 shadow-sm shadow-sky-900/5 mb-10 flex flex-wrap items-center justify-between gap-3 transition-all duration-700 delay-100 ease-out ${
            prefersReducedMotion || isSectionInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-600 mr-1 hidden sm:inline-flex items-center gap-1">
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
                aria-pressed={selectedCategory === tab.id}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-[#154284] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 bg-sky-50/70 border border-sky-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort, View & Animation Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleSortToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-600 text-xs font-mono rounded-lg border border-sky-100 transition-colors whitespace-nowrap"
              title="Toggle Chronological Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#154284]" />
              <span>{sortDirection === 'asc' ? '2016 → 2024' : '2024 → 2016'}</span>
            </button>

            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-600 hover:text-slate-800 text-xs font-mono rounded-lg border border-sky-100 transition-colors whitespace-nowrap"
              title="Expand All Milestone Details"
            >
              Expand All
            </button>

            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-600 hover:text-slate-800 text-xs font-mono rounded-lg border border-sky-100 transition-colors whitespace-nowrap"
              title="Collapse to Concise Summaries"
            >
              Collapse
            </button>

            <button
              type="button"
              onClick={handleReplayAnimation}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#154284] hover:text-[#154284] text-xs font-mono rounded-lg border border-sky-200 transition-colors whitespace-nowrap"
              title="Replay slide-in scroll reveal animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          </div>
        </div>

        {/* Chronological Vertical List with responsive left margin & spine line */}
        <div className="relative pl-10 sm:pl-14 space-y-8 before:absolute before:left-[17px] sm:before:left-[21px] before:top-4 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-[#154284] before:via-sky-400 before:to-[#a50044]">
          {sortedItems.map((item, index) => {
            const Icon = getIconForCategory(item.category);
            const styling = getAccentForCategory(item.category);
            const isExpanded = !!expandedItems[item.id];
            // Check if this item has entered view or section is active
            const isItemVisible = visibleItems[item.id] || isSectionInView;
            const revealStyle = getRevealStyle(isItemVisible, {
              index,
              baseDelayMs: 90,
              maxDelayMs: 600,
              prefersReducedMotion,
            });

            return (
              <div
                key={item.id}
                id={item.id}
                data-item-id={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                style={revealStyle}
                className="relative group transition-all"
              >
                {/* Timeline Node Marker accurately centered on the spine with pulse on reveal */}
                <div
                  className={`absolute -left-[37px] sm:-left-[45px] top-6 w-8 h-8 rounded-full bg-white border-2 ${
                    styling.border
                  } flex items-center justify-center shadow-lg shadow-sky-900/5 transition-all duration-500 ${
                    isItemVisible ? `${styling.nodeGlow} scale-100` : 'scale-75 opacity-70'
                  } group-hover:scale-110 z-10`}
                >
                  <Icon className={`w-4 h-4 ${styling.text}`} />
                </div>

                {/* Milestone Card with subtle slide-in finish */}
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? `${styling.border} shadow-xl shadow-sky-900/5 ${styling.glow}`
                      : 'border-sky-100 hover:border-sky-200'
                  }`}
                >
                  {/* Card Header & Summary Bar */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer select-none flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Top Metadata Line (clean unboxed text with typographic separators) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
                        <span className={`font-semibold tabular-nums ${styling.label}`}>
                          {item.year} · {item.dateStr}
                        </span>
                        <span className="text-slate-500" aria-hidden="true">·</span>
                        <span className="text-slate-600 font-medium uppercase tracking-wider text-[11px]">
                          {item.badge}
                        </span>
                        <span className="text-slate-500" aria-hidden="true">·</span>
                        <span className="text-[#154284] font-mono text-[11px] tabular-nums">
                          Milestone #{item.order} of 6
                        </span>
                      </div>

                      {/* Accomplishment Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-950 group-hover:text-[#154284] transition-colors">
                        {item.title}
                      </h3>

                      {/* Primary Verbatim Accomplishment Statement */}
                      <p className="mt-2 text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                        &ldquo;{item.summary}&rdquo;
                      </p>
                    </div>

                    {/* Metric Badge & Expand Icon */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-sky-100">
                      <div className="bg-sky-50 px-3.5 py-2 rounded-2xl border border-sky-100 text-left lg:text-right font-mono">
                        <span className="text-[10px] text-slate-600 block uppercase tracking-wider">
                          {item.metrics.label}
                        </span>
                        <span className={`text-sm sm:text-base font-bold tabular-nums ${styling.text}`}>
                          {item.metrics.value}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label={isExpanded ? 'Collapse milestone details' : 'Expand milestone details'}
                        aria-expanded={isExpanded}
                        className="p-2 rounded-2xl bg-sky-50 text-slate-600 hover:text-slate-950 border border-sky-100 transition-colors shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#154284]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded In-depth Story & Cross-link Details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-sky-100 bg-sky-50/70 space-y-5 animate-in fade-in duration-200">
                      {/* Deep Historical Details */}
                      <div className="text-sm text-slate-600 leading-relaxed font-normal">
                        <p>{item.details}</p>
                      </div>

                      {/* Highlight Quote if available */}
                      {item.quote && (
                        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                          <Quote className="w-5 h-5 text-[#154284] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm italic text-slate-800 leading-relaxed font-normal">
                              &ldquo;{item.quote.text}&rdquo;
                            </p>
                            <span className="mt-1 block text-xs font-mono text-[#154284]">
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-slate-600 hover:text-slate-950 border border-sky-100 text-xs font-mono transition-colors whitespace-nowrap"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#154284]" />
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 hover:text-sky-800 border border-sky-100 text-xs font-mono transition-colors whitespace-nowrap"
                          >
                            <Star className="w-3.5 h-3.5 text-sky-700" />
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
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-100 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#154284]" />
            </div>
            <div>
              <div className="text-sm font-bold font-sans text-slate-950">
                All 6 Crown Accomplishments Verified
              </div>
              <p className="text-xs text-slate-600">
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
              className="px-4 py-2 bg-[#154284] hover:bg-[#10366e] text-white text-xs font-semibold rounded-lg font-mono transition-colors shrink-0 flex items-center gap-1.5 whitespace-nowrap"
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
