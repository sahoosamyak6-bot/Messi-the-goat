import React, { useState } from 'react';
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

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 bg-[#070b12] text-slate-100"
    >
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

      <main className="flex-1">
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
