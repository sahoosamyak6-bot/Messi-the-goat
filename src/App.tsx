import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { IconicMoment } from './data/messi-data';
import { Trophy } from 'lucide-react';
import { soundFx } from './utils/audio';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);
  const [syncSeasonQuery, setSyncSeasonQuery] = useState<string | undefined>(undefined);
  const navigationFrame = useRef<number | null>(null);

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior, moveFocus = false) => {
    const element = document.getElementById(sectionId);
    if (!element || !element.matches('main > section')) return;

    if (navigationFrame.current !== null) cancelAnimationFrame(navigationFrame.current);
    // Wait for the mobile menu to close before scrolling or moving keyboard focus.
    navigationFrame.current = requestAnimationFrame(() => {
      if (moveFocus) {
        const heading = element.querySelector<HTMLElement>('h1, h2') ?? element;
        const hadTabIndex = heading.hasAttribute('tabindex');
        if (!hadTabIndex) {
          heading.tabIndex = -1;
          heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
        }
        heading.focus({ preventScroll: true });
      }
      element.scrollIntoView({ behavior, block: 'start' });
      setActiveSection(sectionId);
      navigationFrame.current = null;
    });
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    if (!document.getElementById(sectionId)?.matches('main > section')) return;
    const hash = `#${encodeURIComponent(sectionId)}`;
    if (window.location.hash !== hash) {
      window.history.pushState(window.history.state, '', hash);
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollToSection(sectionId, reducedMotion ? 'instant' : 'smooth', true);
  }, [scrollToSection]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    const main = document.getElementById('main-content');
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
    let scrollFrame: number | null = null;

    const updateActiveSection = () => {
      scrollFrame = null;
      const headerHeight = header?.getBoundingClientRect().height ?? 96;
      document.documentElement.style.setProperty('--site-header-height', `${headerHeight}px`);
      const readingLine = headerHeight + 32;
      let current = sections[0]?.id ?? 'hero';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id ?? current;
      }
      setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateActiveSection);
    };
    const followHash = () => {
      try {
        scrollToSection(decodeURIComponent(window.location.hash.slice(1)) || 'hero', 'instant');
      } catch {
        // An invalid escaped fragment should not break the rest of the page.
      }
    };

    updateActiveSection();
    if (window.location.hash) followHash();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    if (header) resizeObserver.observe(header);
    if (main) resizeObserver.observe(main);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', followHash);
      window.removeEventListener('popstate', followHash);
      resizeObserver.disconnect();
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      if (navigationFrame.current !== null) cancelAnimationFrame(navigationFrame.current);
    };
  }, [scrollToSection]);

  const handleSyncSeason = (seasonLabel: string) => {
    setSyncSeasonQuery(seasonLabel);
  };

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 bg-[#070b12] text-slate-100"
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Floating Quick-Jump Badge replacing the single rotating notification */}
      <div className="fixed right-4 bottom-6 z-40 hidden sm:block">
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
      />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Hero onNavigate={handleNavigate} />
        <AchievementTimeline
          onNavigate={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
        />
        <CareerTimeline
          onNavigateToSection={handleNavigate}
          onSyncSeasonFilter={handleSyncSeason}
        />
        <Biography />
        <CareerStats
          externalSeasonQuery={syncSeasonQuery}
          onClearExternalSeason={() => setSyncSeasonQuery(undefined)}
        />
        <IconicGallery onSelectMoment={(m) => setSelectedMoment(m)} />
        <PitchVisualizer />
        <TrophyCabinet />
        <QuotesAndTrivia />
      </main>

      <Footer onNavigate={handleNavigate} />
      <MomentModal moment={selectedMoment} onClose={() => setSelectedMoment(null)} />
    </div>
  );
}
