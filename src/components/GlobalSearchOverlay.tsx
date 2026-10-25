import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Trophy,
  Calendar,
  Sparkles,
  BookOpen,
  Target,
  ArrowRight,
  Clock,
  Trash2,
  CornerDownLeft,
} from 'lucide-react';
import {
  searchArchive,
  SearchCategory,
  SearchIndexItem,
  splitTextForHighlight,
  POPULAR_SEARCH_PROMPTS,
} from '../utils/searchIndex';
import { soundFx } from '../utils/audio';

interface GlobalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (item: SearchIndexItem) => void;
}

const RECENT_SEARCHES_STORAGE_KEY = 'messi_archive_recent_searches_v1';
const MAX_RECENT_SEARCHES = 6;

export const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearRecentSearches = () => {
    soundFx.playClickTone();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const removeSingleRecentSearch = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    soundFx.playClickTone();
    const updated = recentSearches.filter((s) => s !== text);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Perform search
  const results = useMemo(() => {
    return searchArchive(query, selectedCategory, 30);
  }, [query, selectedCategory]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Focus input and lock background scroll when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const activeEl = resultsContainerRef.current.querySelector<HTMLElement>(`[data-result-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Keyboard navigation inside the overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundFx.playClickTone();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundFx.playClickTone();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundFx.playClickTone();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex].item);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelectResult = (item: SearchIndexItem) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    if (item.category === 'trophy' || item.category === 'milestone') {
      soundFx.playCelebrationChime();
    } else {
      soundFx.playClickTone();
    }
    onSelectResult(item);
    onClose();
  };

  const handlePromptClick = (prompt: string) => {
    soundFx.playClickTone();
    setQuery(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const categories: Array<{ id: SearchCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Results', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'year', label: 'Years & Seasons', icon: <Calendar className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'trophy', label: 'Trophies & Honors', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'milestone', label: 'Milestones & Records', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'biography', label: 'Biography', icon: <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'goal', label: 'Iconic Goals', icon: <Target className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Archive Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 pb-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md transition-all animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playClickTone();
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#090e18] border border-amber-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-amber-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-800 bg-[#0c1322]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search years (e.g. 2012, 2022), trophies (World Cup, Ballon d'Or), or milestones (napkin, sextuple)..."
            aria-label="Search the archive"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base font-medium focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 rounded shadow-sm">
              ESC
            </kbd>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close search overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto whitespace-nowrap bg-[#080d16] border-b border-slate-800/80 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Container / Empty State */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 sm:p-3">
          {query.trim() === '' ? (
            <div className="py-6 px-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        onClick={() => handlePromptClick(item)}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 cursor-pointer transition-colors"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={(e) => removeSingleRecentSearch(e, item)}
                          className="text-slate-500 group-hover:text-slate-400 hover:text-rose-400"
                          title="Remove from history"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Search Suggestions */}
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Key Archive Topics & Milestones
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_SEARCH_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c1322] hover:bg-[#111a2e] border border-slate-800 hover:border-amber-500/40 text-left text-xs text-slate-200 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                        <span className="font-medium group-hover:text-amber-300 transition-colors">{prompt}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Quick Index */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                <span className="font-semibold text-amber-300">Archive Search Tip:</span> Search across 20+ years of
                stats, 46 official trophies, 6 crown timeline milestones, tactical pitch animations, and detailed
                biography chapters.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-1">No matching entries found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                We couldn&rsquo;t find anything matching &ldquo;{query}&rdquo; in {selectedCategory === 'all' ? 'the archive' : selectedCategory}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePromptClick('2012')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800"
                >
                  Try &ldquo;2012&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick('World Cup')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800"
                >
                  Try &ldquo;World Cup&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick("Ballon d'Or")}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800"
                >
                  Try &ldquo;Ballon d&rsquo;Or&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Clear filter
                </button>
              </div>
            </div>
          ) : (
            results.map((result, idx) => {
              const isSelected = idx === selectedIndex;
              const { item } = result;

              const getCategoryBadgeClass = (category: SearchCategory) => {
                switch (category) {
                  case 'trophy':
                    return 'bg-amber-400/10 text-amber-300 border-amber-400/30';
                  case 'milestone':
                    return 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30';
                  case 'year':
                    return 'bg-sky-400/10 text-sky-300 border-sky-400/30';
                  case 'biography':
                    return 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30';
                  case 'goal':
                    return 'bg-rose-400/10 text-rose-300 border-rose-400/30';
                }
              };

              const getCategoryIcon = (category: SearchCategory) => {
                switch (category) {
                  case 'trophy':
                    return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
                  case 'milestone':
                    return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
                  case 'year':
                    return <Calendar className="w-3.5 h-3.5 text-sky-400" />;
                  case 'biography':
                    return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
                  case 'goal':
                    return <Target className="w-3.5 h-3.5 text-rose-400" />;
                }
              };

              const titleSegments = splitTextForHighlight(item.title, query);
              const subtitleSegments = splitTextForHighlight(item.subtitle, query);

              return (
                <div
                  key={item.id}
                  data-result-index={idx}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group relative p-3 sm:p-3.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#121c32] ring-1 ring-amber-400/50 shadow-md'
                      : 'hover:bg-[#0c1424]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Category and badges */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {getCategoryIcon(item.category)}
                          <span>{item.categoryLabel}</span>
                        </span>

                        {item.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                            {item.badge}
                          </span>
                        )}

                        {item.year && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                            {item.year}
                          </span>
                        )}
                      </div>

                      {/* Title with highlight */}
                      <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {titleSegments.map((seg, sIdx) =>
                          seg.isMatch ? (
                            <mark
                              key={sIdx}
                              className="bg-amber-400/25 text-amber-300 font-semibold rounded px-0.5"
                            >
                              {seg.text}
                            </mark>
                          ) : (
                            <span key={sIdx}>{seg.text}</span>
                          )
                        )}
                      </h4>

                      {/* Subtitle */}
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {subtitleSegments.map((seg, sIdx) =>
                          seg.isMatch ? (
                            <mark
                              key={sIdx}
                              className="bg-amber-400/20 text-amber-300 font-medium rounded px-0.5"
                            >
                              {seg.text}
                            </mark>
                          ) : (
                            <span key={sIdx}>{seg.text}</span>
                          )
                        )}
                      </p>

                      {/* Excerpt */}
                      {item.description && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Navigation arrow / Action indicator */}
                    <div className="shrink-0 self-center hidden sm:flex items-center gap-1.5 pl-2">
                      <span className="text-[11px] font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                        Jump
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 scale-110 shadow'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-amber-400 group-hover:text-slate-950'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#070b12] border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px]">↓</kbd>
              <span className="text-slate-500">Navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px]">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd>
              <span className="text-slate-500">Select</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px]">ESC</kbd>
              <span className="text-slate-500">Close</span>
            </span>
            <span className="sm:hidden text-slate-500">
              Tap any entry to jump
            </span>
          </div>

          <div className="text-slate-400">
            {query.trim() ? (
              <span>
                <strong className="text-amber-400 font-semibold">{results.length}</strong>{' '}
                {results.length === 1 ? 'match' : 'matches'}
              </span>
            ) : (
              <span className="text-slate-500">The Definitive Messi Archive</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
