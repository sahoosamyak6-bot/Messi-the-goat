import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { MobileQuickNav } from './components/MobileQuickNav';
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
import { MessiArcade } from './components/MessiArcade';
import { LegacyLab } from './components/LegacyLab';
import { LatestCoverage } from './components/LatestCoverage';
import { ShareModal } from './components/ShareModal';
import { soundFx } from './utils/audio';
import { sectionFromHash } from './utils/navigation';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);
  const [syncSeasonQuery, setSyncSeasonQuery] = useState<string | undefined>(undefined);
  const [selectedBioChapter, setSelectedBioChapter] = useState<string | undefined>(undefined);
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<number | undefined>(undefined);
  const [selectedTrophyId, setSelectedTrophyId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTargetSection, setShareTargetSection] = useState('hero');

  const [originalLabOpen, setOriginalLabOpen] = useState(false);
  const [requestKeys, setRequestKeys] = useState({ chapter: 0, year: 0, trophy: 0, statistics: 0 });
  const requestSelection = (key: keyof typeof requestKeys) => setRequestKeys(previous => ({ ...previous, [key]: previous[key] + 1 }));

  const originalLabRef = useRef<HTMLDetailsElement>(null);

  // Global keyboard shortcut listeners (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // A second modal must not open over gallery or trophy details.
      if (document.querySelector('dialog[open]:not(#archive-search-dialog)')) return;
      // Preserve the user's section-sharing shortcut without intercepting edits
      // or opening a second modal over search.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' &&
          !document.querySelector('dialog[open]') &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
          !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault();
        setShareTargetSection(activeSection);
        setIsShareOpen(true);
        return;
      }
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
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !(e.target as HTMLElement)?.isContentEditable && !e.metaKey && !e.ctrlKey && !e.altKey
      ) {
        e.preventDefault();
        soundFx.playClickTone();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (document.querySelector('header')?.getBoundingClientRect().height || 86) + 130;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
      const current = sections.filter(section => section.getClientRects().length && section.getBoundingClientRect().top <= threshold).at(-1);
      setActiveSection(current?.id || 'hero');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const restoreHash = () => {
      const id = sectionFromHash(location.hash);
      if (id === 'pitch-visualizer' && originalLabRef.current) originalLabRef.current.open = true;
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('popstate', restoreHash);
    window.addEventListener('hashchange', restoreHash);
    if (location.hash) restoreHash(); else update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('popstate', restoreHash); window.removeEventListener('hashchange', restoreHash); };
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'pitch-visualizer' && originalLabRef.current) originalLabRef.current.open = true;
    const element = document.getElementById(sectionId);
    if (!element) return;
    setActiveSection(sectionId);
    if (location.hash !== `#${sectionId}`) history.pushState(null, '', `#${sectionId}`);
    element.tabIndex = -1;
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const handleSyncSeason = (seasonLabel: string) => {
    setSyncSeasonQuery(seasonLabel);
    requestSelection('statistics');
  };

  const handleOpenShare = (sectionId = activeSection) => {
    setShareTargetSection(sectionId);
    setIsShareOpen(true);
    soundFx.playClickTone();
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
        requestSelection('statistics');
        handleNavigate('statistics');
      } else {
        if (action.payload?.year) {
          setSelectedTimelineYear(action.payload.year);
          requestSelection('year');
        }
        handleNavigate('career-timeline');
      }
    } else if (action.type === 'trophy') {
      if (action.payload?.trophyId) {
        setSelectedTrophyId(action.payload.trophyId);
        requestSelection('trophy');
      }
      handleNavigate('trophies');
    } else if (action.type === 'chapter') {
      if (action.payload?.chapterId) {
        setSelectedBioChapter(action.payload.chapterId);
        requestSelection('chapter');
      }
      handleNavigate('biography');
    } else {
      handleNavigate(action.sectionId);
      if (action.payload?.focusId) {
        requestAnimationFrame(() => {
          const target = document.getElementById(action.payload.focusId);
          if (!target) return;
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      }
    }
  };

  return (
    <div
      id="app"
      className="site-shell min-h-screen flex flex-col"
    >
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenShare={() => handleOpenShare()}
      />

      <main id="main-content" tabIndex={-1} className="archive-content flex-1">
        <MobileQuickNav onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} />
        <Hero
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <p className="archive-status">An independent fan archive. Historical statistics are preserved from the original project; the coverage below refreshes separately from a credited publisher.</p>
        <LatestCoverage />
        <AchievementTimeline
          onNavigate={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
        />
        <CareerTimeline
          onNavigateToSection={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
          externalSelectedYear={selectedTimelineYear}
          externalRequestKey={requestKeys.year}
        />
        <Biography externalChapterId={selectedBioChapter} externalRequestKey={requestKeys.chapter} />
        <CareerStats
          externalSeasonQuery={syncSeasonQuery}
          externalRequestKey={requestKeys.statistics}
          onClearExternalSeason={() => setSyncSeasonQuery(undefined)}
        />
        <IconicGallery onSelectMoment={(m) => setSelectedMoment(m)} />
        <LegacyLab />
        <details ref={originalLabRef} className="original-lab" onToggle={event => setOriginalLabOpen(event.currentTarget.open)}>
          <summary>Keep exploring: the original goal simulator <span>More tactics, replays and shot controls</span></summary>
          <PitchVisualizer active={originalLabOpen} onShareSection={() => handleOpenShare('pitch-visualizer')} />
        </details>
        <MessiArcade />
        <TrophyCabinet externalTrophyId={selectedTrophyId} externalRequestKey={requestKeys.trophy} />
        <QuotesAndTrivia />
      </main>

      <Footer onNavigate={handleNavigate} onOpenShare={() => handleOpenShare()} />
      <MomentModal moment={selectedMoment} onClose={() => setSelectedMoment(null)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} currentSectionId={shareTargetSection} onNavigateToSection={handleNavigate} />

      {/* Global Search Overlay Palette */}
      <GlobalSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
