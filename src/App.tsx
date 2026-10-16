import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Biography } from './components/Biography';
import { CareerStats } from './components/CareerStats';
import { IconicGallery } from './components/IconicGallery';
import { PitchVisualizer } from './components/PitchVisualizer';
import { TrophyCabinet } from './components/TrophyCabinet';
import { QuotesAndTrivia } from './components/QuotesAndTrivia';
import { Footer } from './components/Footer';
import { MomentModal } from './components/MomentModal';
import { IconicMoment } from './data/messi-data';

const achievementNotifications = [
  'Achievement unlocked: Messi won the 2022 FIFA World Cup and claimed the Golden Ball.',
  'Achievement unlocked: Messi captured his eighth Ballon d’Or, extending the record.',
  'Achievement unlocked: Messi became the all-time top scorer for Argentina with a legendary international haul.',
  'Achievement unlocked: Messi reached 850+ senior career goals across club and country.',
  'Achievement unlocked: Messi lifted the 2023 Leagues Cup with Inter Miami and inspired a new era.',
  'Achievement unlocked: Messi won a record-setting 46 major trophies in his illustrious career.',
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);
  const [theme, setTheme] = useState<'ivory' | 'sunrise'>('ivory');
  const [notification, setNotification] = useState<string>(achievementNotifications[0]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNotification((current) => {
        const currentIndex = achievementNotifications.indexOf(current);
        const nextIndex = (currentIndex + 1) % achievementNotifications.length;
        return achievementNotifications[nextIndex];
      });
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="app"
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 ${
        theme === 'ivory' ? 'theme-ivory' : 'theme-sunrise'
      }`}
    >
      <div className="fixed right-4 top-24 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-amber-300/70 bg-amber-100/90 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-amber-300/80 bg-amber-200/80 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.24em] text-amber-900">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Latest achievement
        </div>
        <p className="px-3 py-3 text-sm font-medium leading-relaxed text-slate-800">
          {notification}
        </p>
      </div>

      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'ivory' ? 'sunrise' : 'ivory'))}
      />

      <main className="flex-1">
        <Hero onNavigate={handleNavigate} />
        <Biography />
        <CareerStats />
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
