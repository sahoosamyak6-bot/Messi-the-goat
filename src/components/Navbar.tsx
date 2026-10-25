import React, { useEffect, useId, useRef, useState } from 'react';
import { Volume2, VolumeX, Menu, X, Trophy, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuId = useId();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => {
      if (desktop.matches) {
        if (mobileMenuRef.current?.contains(document.activeElement)) brandRef.current?.focus();
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [mobileMenuOpen]);

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

  const handleNavClick = (id: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
    // Preserve the browser's new-tab, copy-link, and other native anchor behavior.
    if (event && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event?.preventDefault();
    soundFx.playClickTone();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      ref={headerRef}
      data-site-header
      onBlur={(event) => {
        if (mobileMenuOpen && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
          setMobileMenuOpen(false);
        }
      }}
      className="sticky top-0 z-50 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800/80"
    >
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
          <a
            ref={brandRef}
            href="#hero"
            onClick={(event) => handleNavClick('hero', event)}
            className="flex shrink-0 items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
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
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(event) => handleNavClick(item.id, event)}
                  className={`relative whitespace-nowrap py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('trivia-quotes')}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take GOAT Quiz</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <nav
        ref={mobileMenuRef}
        id={mobileMenuId}
        hidden={!mobileMenuOpen}
        aria-label="Mobile navigation"
        className="absolute top-full left-0 right-0 xl:hidden max-h-[calc(100dvh-var(--site-header-height))] overflow-y-auto border-t border-slate-800 bg-[#080d16] px-4 pt-3 pb-5 space-y-2"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(event) => handleNavClick(item.id, event)}
              className={`block w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          );
        })}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleNavClick('trivia-quotes')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Sparkles className="w-4 h-4" />
            Take GOAT Trivia Quiz
          </button>
        </div>
      </nav>
    </header>
  );
};
