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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef(true);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((value): value is string => typeof value === 'string').slice(0, MAX_RECENT_SEARCHES));
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
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    restoreFocusRef.current = true;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus({ preventScroll: true });
    inputRef.current?.select();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (restoreFocusRef.current) previousFocus?.focus({ preventScroll: true });
    };
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
      if (e.target !== inputRef.current) return;

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
    // Release native modal inertness before the destination receives focus.
    restoreFocusRef.current = false;
    dialogRef.current?.close();
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
    { id: 'all', label: 'All Results', icon: <Sparkles className="w-3.5 h-3.5 text-[#154284]" /> },
    { id: 'year', label: 'Years & Seasons', icon: <Calendar className="w-3.5 h-3.5 text-sky-700" /> },
    { id: 'trophy', label: 'Trophies & Honors', icon: <Trophy className="w-3.5 h-3.5 text-[#154284]" /> },
    { id: 'milestone', label: 'Milestones & Records', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> },
    { id: 'biography', label: 'Biography', icon: <BookOpen className="w-3.5 h-3.5 text-indigo-700" /> },
    { id: 'goal', label: 'Iconic Goals', icon: <Target className="w-3.5 h-3.5 text-rose-700" /> },
  ];

  return (
    <dialog
      id="archive-search-dialog"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Archive Global Search"
      className="archive-content fixed inset-0 z-50 m-0 h-dvh w-full max-h-none max-w-none flex items-start justify-center p-3 sm:p-4 overflow-y-auto bg-transparent transition-all animate-fadeIn"
      onCancel={(event) => {
        event.preventDefault();
        soundFx.playClickTone();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playClickTone();
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white border border-sky-200 shadow-[0_24px_100px_-24px_rgba(15,48,80,0.35)] overflow-hidden flex flex-col max-h-[calc(100dvh_-_24px)] sm:max-h-[calc(100dvh_-_32px)] ring-1 ring-sky-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center gap-2 px-3 sm:px-5 py-3 shrink-0 border-b border-sky-100 bg-sky-50/70">
          <Search className="w-5 h-5 text-[#154284] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search years (e.g. 2012, 2022), trophies (World Cup, Ballon d'Or), or milestones (napkin, sextuple)..."
            aria-label="Search the archive"
            className="min-w-0 flex-1 w-full bg-transparent text-slate-950 placeholder-slate-500 text-base font-medium focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setQuery('');
                inputRef.current?.focus();
              }}
              className="shrink-0 min-w-11 min-h-11 grid place-items-center rounded-full text-slate-600 hover:text-slate-950 hover:bg-sky-100 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-sky-100">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-600 bg-sky-50 border border-sky-200 rounded-lg shadow-sm">
              ESC
            </kbd>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onClose();
              }}
              className="min-w-11 min-h-11 grid place-items-center rounded-2xl text-slate-600 hover:text-slate-950 hover:bg-sky-100 transition-colors"
              aria-label="Close search overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 shrink-0 overflow-x-auto whitespace-nowrap bg-sky-50/70 border-b border-sky-100 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(cat.id);
                }}
                className={`flex shrink-0 min-h-11 items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#154284] text-white [&_svg]:text-white font-semibold shadow-sm'
                    : 'bg-sky-50 text-slate-600 hover:text-slate-950 hover:bg-sky-100 border border-sky-100'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Container / Empty State */}
        <div ref={resultsContainerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain divide-y divide-sky-100 p-2 sm:p-3">
          {query.trim() === '' ? (
            <div className="py-6 px-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 uppercase tracking-wider mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#154284]" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-slate-500 hover:text-rose-700 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 hover:border-sky-200 rounded-2xl text-xs text-slate-800 cursor-pointer transition-colors"
                      >
                        <button type="button" onClick={() => handlePromptClick(item)}>{item}</button>
                        <button
                          type="button"
                          onClick={(e) => removeSingleRecentSearch(e, item)}
                          className="text-slate-500 group-hover:text-slate-600 hover:text-rose-700"
                          title="Remove from history"
                          aria-label={`Remove ${item} from history`}
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
                <div className="text-xs font-mono text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#154284]" />
                  Key Archive Topics & Milestones
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_SEARCH_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 hover:border-sky-300 text-left text-xs text-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#154284] group-hover:scale-125 transition-transform" />
                        <span className="font-medium group-hover:text-[#154284] transition-colors">{prompt}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#154284] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Quick Index */}
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-blue-900 leading-relaxed">
                <span className="font-semibold text-[#154284]">Archive Search Tip:</span> Search across 20+ years of
                stats, 46 official trophies, 6 crown timeline milestones, tactical pitch animations, and detailed
                biography chapters.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No matching entries found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-4">
                We couldn&rsquo;t find anything matching &ldquo;{query}&rdquo; in {selectedCategory === 'all' ? 'the archive' : selectedCategory}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePromptClick('2012')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 border border-sky-100 text-[#154284] hover:bg-sky-100"
                >
                  Try &ldquo;2012&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick('World Cup')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 border border-sky-100 text-[#154284] hover:bg-sky-100"
                >
                  Try &ldquo;World Cup&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick("Ballon d'Or")}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 border border-sky-100 text-[#154284] hover:bg-sky-100"
                >
                  Try &ldquo;Ballon d&rsquo;Or&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 border border-sky-100 text-slate-600 hover:bg-sky-100"
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
                    return 'bg-sky-50 text-[#154284] border-sky-200';
                  case 'milestone':
                    return 'bg-emerald-400/10 text-emerald-800 border-emerald-400/30';
                  case 'year':
                    return 'bg-sky-400/10 text-sky-800 border-sky-400/30';
                  case 'biography':
                    return 'bg-indigo-400/10 text-indigo-800 border-indigo-400/30';
                  case 'goal':
                    return 'bg-rose-400/10 text-rose-800 border-rose-400/30';
                }
              };

              const getCategoryIcon = (category: SearchCategory) => {
                switch (category) {
                  case 'trophy':
                    return <Trophy className="w-3.5 h-3.5 text-[#154284]" />;
                  case 'milestone':
                    return <Sparkles className="w-3.5 h-3.5 text-emerald-700" />;
                  case 'year':
                    return <Calendar className="w-3.5 h-3.5 text-sky-700" />;
                  case 'biography':
                    return <BookOpen className="w-3.5 h-3.5 text-indigo-700" />;
                  case 'goal':
                    return <Target className="w-3.5 h-3.5 text-rose-700" />;
                }
              };

              const titleSegments = splitTextForHighlight(item.title, query);
              const subtitleSegments = splitTextForHighlight(item.subtitle, query);

              return (
                <button
                  key={item.id}
                  type="button"
                  data-result-index={idx}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onFocus={() => setSelectedIndex(idx)}
                  className={`group relative w-full text-left p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 ring-1 ring-sky-300 shadow-md shadow-sky-900/5'
                      : 'hover:bg-sky-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Category and badges */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {getCategoryIcon(item.category)}
                          <span>{item.categoryLabel}</span>
                        </span>

                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-sky-100 text-[#154284] border border-sky-200">
                            {item.badge}
                          </span>
                        )}

                        {item.year && (
                          <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-600 bg-sky-50 border border-sky-100">
                            {item.year}
                          </span>
                        )}
                      </div>

                      {/* Title with highlight */}
                      <h4 className="text-sm sm:text-base font-semibold text-slate-950 group-hover:text-[#154284] transition-colors line-clamp-1">
                        {titleSegments.map((seg, sIdx) =>
                          seg.isMatch ? (
                            <mark
                              key={sIdx}
                              className="bg-sky-100 text-[#154284] font-semibold rounded-lg px-0.5"
                            >
                              {seg.text}
                            </mark>
                          ) : (
                            <span key={sIdx}>{seg.text}</span>
                          )
                        )}
                      </h4>

                      {/* Subtitle */}
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {subtitleSegments.map((seg, sIdx) =>
                          seg.isMatch ? (
                            <mark
                              key={sIdx}
                              className="bg-sky-100 text-[#154284] font-medium rounded-lg px-0.5"
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
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Navigation arrow / Action indicator */}
                    <div className="shrink-0 self-center hidden sm:flex items-center gap-1.5 pl-2">
                      <span className="text-[11px] font-mono text-slate-500 group-hover:text-[#154284] transition-colors">
                        Jump
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#154284] text-white scale-110 shadow'
                            : 'bg-sky-100 text-slate-600 group-hover:bg-[#154284] group-hover:text-white'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-sky-100 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px]">↓</kbd>
              <span className="text-slate-500">Navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px]">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd>
              <span className="text-slate-500">Select</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px]">ESC</kbd>
              <span className="text-slate-500">Close</span>
            </span>
            <span className="sm:hidden text-slate-500">
              Tap any entry to jump
            </span>
          </div>

          <div className="text-slate-600">
            {query.trim() ? (
              <span>
                <strong className="text-[#154284] font-semibold">{results.length}</strong>{' '}
                {results.length === 1 ? 'match' : 'matches'}
              </span>
            ) : (
              <span className="text-slate-500">The Definitive Messi Archive</span>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};
