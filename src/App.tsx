import React, { useState } from 'react';
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

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Top Navigation */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onNavigate={handleNavigate} />

        {/* 1. Comprehensive Biography */}
        <Biography />

        {/* 2. Career Statistics & Competitions */}
        <CareerStats />

        {/* 3. Curated Gallery of Iconic Moments & Video Links */}
        <IconicGallery onSelectMoment={(m) => setSelectedMoment(m)} />

        {/* 4. Interactive Goal Lab & Pitch Visualizer */}
        <PitchVisualizer />

        {/* 5. 46 Trophies & Major Awards Cabinet */}
        <TrophyCabinet />

        {/* 6. Voices on Messi & Interactive GOAT Trivia Quiz */}
        <QuotesAndTrivia />
      </main>

      {/* Editorial Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Tactical Inspection Modal */}
      <MomentModal moment={selectedMoment} onClose={() => setSelectedMoment(null)} />
    </div>
  );
}
