import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, Trophy, Sparkles, Search, Share2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenShare,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playClickTone();
    }
  };

  const navItems = [
    { id: 'biography', label: 'Biography' },
    { id: 'achievement-timeline', label: 'Achievements' },
    { id: 'career-timeline', label: 'Timeline' },
    { id: 'statistics', label: 'Career Statistics' },
    { id: 'gallery', label: 'Iconic Gallery' },
    { id: 'pitch-visualizer', label: 'Goal Lab' },
    { id: 'trophies', label: 'Trophy Cabinet' },
    { id: 'trivia-quotes', label: 'Quotes & Trivia' },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClickTone();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Editorial Top Ticker Bar */}
      <div className="bg-[#0b1220] border-b border-slate-800/50 py-1.5 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
              RECORD SILVERWARE: 46 OFFICIAL TITLES
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">8x Ballon d’Or</span>
            <span className="text-slate-600 hidden md:inline">·</span>
            <span className="text-slate-300 hidden md:inline">2022 World Cup Champion & Golden Ball</span>
            <span className="text-slate-600 hidden lg:inline">·</span>
            <span className="text-slate-300 hidden lg:inline">91 Goals in a Calendar Year (2012)</span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute interactive sound effects' : 'Mute interactive sound effects'}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 px-2 py-0.5"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sound: Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline text-sky-400">Sound: On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <div className="w-9 h-9 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif-prestige font-bold text-slate-950 text-lg shadow-sm">
              10
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold font-serif-prestige tracking-widest text-slate-100 group-hover:text-amber-400 transition-colors">
                LIONEL MESSI
              </div>
              <div className="text-[10px] tracking-wider text-slate-400 uppercase font-mono">
                The Definitive Archive
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onOpenSearch();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1424] hover:bg-[#121c32] border border-slate-700/80 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Search the Archive (Cmd+K or Ctrl+K)"
              aria-label="Search the archive"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-slate-300 group-hover:text-amber-300">Search archive...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700/80 rounded group-hover:border-amber-400/30">
                ⌘K
              </kbd>
            </button>

            {/* Share Trigger Button */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                onOpenShare?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1424] hover:bg-[#121c32] border border-slate-700/80 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Share active section (Link & Post Snippet)"
              aria-label="Share active section link and social snippet"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-slate-300 group-hover:text-amber-300">Share</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('trivia-quotes')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take GOAT Quiz</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="p-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#080d16] px-4 pt-3 pb-5 space-y-2">
          {/* Quick Search in Mobile Drawer */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFx.playClickTone();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#0e1628] border border-amber-500/30 text-amber-300 text-xs font-medium shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Years, Trophies, Milestones...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Quick Share in Mobile Drawer */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFx.playClickTone();
              onOpenShare?.();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#0e1628] border border-slate-700/80 hover:border-amber-400/50 text-slate-200 text-xs font-medium mb-3 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share Active Section & Snippet</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400/90 uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
              Share
            </span>
          </button>

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleNavClick('trivia-quotes')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Take GOAT Trivia Quiz
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
