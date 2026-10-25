import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AchievementTimeline } from './components/AchievementTimeline';
import { CareerTimeline } from './components/CareerTimeline';
import { Biography } from './components/Biography';
import { CareerStats } from './components/CareerStats';
import { IconicGallery } from './components/IconicGallery';
import { PitchVisualizer } from './components/PitchVisualizer';
import { TrophyCabinet } from './components/TrophyCabinet';
import { QuotesAndTrivia } from './components/QuotesAndTrivia';
import { Footer } from './components/Footer';
import { MomentModal } from './components/MomentModal';
import { GlobalSearchOverlay } from './components/GlobalSearchOverlay';
import { IconicMoment } from './data/messi-data';
import { SearchIndexItem } from './utils/searchIndex';
import { Trophy, Search } from 'lucide-react';
import { soundFx } from './utils/audio';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);
  const [syncSeasonQuery, setSyncSeasonQuery] = useState<string | undefined>(undefined);
  const [selectedBioChapter, setSelectedBioChapter] = useState<string | undefined>(undefined);
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<number | undefined>(undefined);
  const [selectedTrophyId, setSelectedTrophyId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global keyboard shortcut listeners (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFx.playClickTone();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Forward slash '/' to open search when not typing in an input/textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        soundFx.playClickTone();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSyncSeason = (seasonLabel: string) => {
    setSyncSeasonQuery(seasonLabel);
  };

  const handleSelectSearchResult = (item: SearchIndexItem) => {
    const { action } = item;

    // Handle deep navigation based on item type
    if (action.type === 'moment' && item.originalMoment) {
      setSelectedMoment(item.originalMoment);
      handleNavigate('gallery');
    } else if (action.type === 'season') {
      if (action.sectionId === 'statistics') {
        setSyncSeasonQuery(action.payload?.seasonQuery);
        handleNavigate('statistics');
      } else {
        if (action.payload?.year) {
          setSelectedTimelineYear(action.payload.year);
        }
        handleNavigate('career-timeline');
      }
    } else if (action.type === 'trophy') {
      if (action.payload?.trophyId) {
        setSelectedTrophyId(action.payload.trophyId);
      }
      handleNavigate('trophies');
    } else if (action.type === 'chapter') {
      if (action.payload?.chapterId) {
        setSelectedBioChapter(action.payload.chapterId);
      }
      handleNavigate('biography');
    } else {
      handleNavigate(action.sectionId);
    }
  };

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 bg-[#070b12] text-slate-100"
    >
      {/* Floating Action Controls (Achievements Jump + Quick Search trigger) */}
      <div className="fixed right-4 bottom-6 z-40 hidden sm:flex flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={() => {
            soundFx.playClickTone();
            setIsSearchOpen(true);
          }}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0d1527]/90 hover:bg-[#121f3a] text-amber-300 border border-slate-700/80 hover:border-amber-400/60 shadow-xl backdrop-blur-md text-xs font-mono transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Search the Archive (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-slate-200 group-hover:text-amber-300">Search Archive</span>
          <kbd className="px-1 py-0.2 bg-slate-900 border border-slate-700 text-[9px] rounded text-slate-400">⌘K</kbd>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClickTone();
            handleNavigate('achievement-timeline');
          }}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0a0f1d]/90 hover:bg-[#0f172a] text-amber-300 border border-amber-400/40 shadow-2xl backdrop-blur-md text-xs font-mono transition-all hover:scale-105 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Jump to the 6 Crown Achievements Timeline"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold tracking-wide">6 Crown Achievements</span>
        </button>
      </div>

      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        <Hero
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <AchievementTimeline
          onNavigate={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
        />
        <CareerTimeline
          onNavigateToSection={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
          externalSelectedYear={selectedTimelineYear}
        />
        <Biography externalChapterId={selectedBioChapter} />
        <CareerStats
          externalSeasonQuery={syncSeasonQuery}
          onClearExternalSeason={() => setSyncSeasonQuery(undefined)}
        />
        <IconicGallery onSelectMoment={(m) => setSelectedMoment(m)} />
        <PitchVisualizer />
        <TrophyCabinet externalTrophyId={selectedTrophyId} />
        <QuotesAndTrivia />
      </main>

      <Footer onNavigate={handleNavigate} />
      <MomentModal moment={selectedMoment} onClose={() => setSelectedMoment(null)} />

      {/* Global Search Overlay Palette */}
      <GlobalSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
