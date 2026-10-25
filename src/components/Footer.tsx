import React from 'react';
import { Trophy, Heart, ArrowUp, Share2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenShare }) => {
  const scrollToTop = () => {
    soundFx.playClickTone();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05080e] border-t border-slate-800 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand & Editorial Manifesto */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif-prestige font-bold text-slate-950 text-base shadow-sm">
                10
              </div>
              <div>
                <span className="font-serif-prestige font-bold text-white tracking-widest text-base">
                  LIONEL ANDRÉS MESSI
                </span>
                <span className="block text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  The Definitive Archive
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              An immersive chronicle commemorating the life, tactical genius, official statistical records, and immortal moments of association football&rsquo;s greatest artist.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-500">
              Grandoli · Newell&rsquo;s Old Boys · FC Barcelona · PSG · Inter Miami · Argentina
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Archive Index
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('biography')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Full Biography
              </button>
              <button
                type="button"
                onClick={() => onNavigate('statistics')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Career Statistics
              </button>
              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Iconic Moments
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pitch-visualizer')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Tactical Goal Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate('trophies')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Trophy Cabinet
              </button>
              <button
                type="button"
                onClick={() => onNavigate('trivia-quotes')}
                className="text-left text-slate-400 hover:text-amber-400 transition-colors"
              >
                Trivia & Quotes
              </button>
              {onOpenShare && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickTone();
                    onOpenShare();
                  }}
                  className="text-left text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3 h-3 text-amber-400" />
                  <span>Share Section Link</span>
                </button>
              )}
            </div>
          </div>

          {/* Records Summary */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Historical Summit
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 font-light">
              <li className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                46 Official Team Trophies
              </li>
              <li>8x Ballon d&rsquo;Or Record</li>
              <li>2022 World Cup Champion</li>
              <li>91 Goals in a Year (2012)</li>
              <li>6x European Golden Shoe</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <span>Dedicated to the memory of Celia Oliveira Cuccittini</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
