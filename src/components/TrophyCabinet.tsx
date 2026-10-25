import React, { useState, useMemo } from 'react';
import { TROPHIES_DATA } from '../data/messi-data';
import { TrophyItem } from '../types/messi';
import { Trophy, Award, Search, Sparkles, Star, Calendar, Info } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TrophyCabinetProps {
  externalTrophyId?: string;
}

export const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ externalTrophyId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTrophy, setActiveTrophy] = useState<TrophyItem | null>(null);

  React.useEffect(() => {
    if (externalTrophyId) {
      const match = TROPHIES_DATA.find((t) => t.id === externalTrophyId);
      if (match) {
        setActiveTrophy(match);
      }
    }
  }, [externalTrophyId]);

  const categories = [
    { id: 'all', label: 'All Silverware & Honors' },
    { id: 'international', label: 'Argentina National Team' },
    { id: 'continental', label: 'Continental & World' },
    { id: 'domestic_league', label: 'League Championships' },
    { id: 'domestic_cup', label: 'Domestic Cups' },
    { id: 'individual', label: 'Individual Awards' },
  ];

  const filteredTrophies = useMemo(() => {
    return TROPHIES_DATA.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTrophy = (item: TrophyItem) => {
    soundFx.playCelebrationChime();
    setActiveTrophy(item);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTrophy(null);
      }
    };
    if (activeTrophy) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeTrophy]);

  return (
    <section id="trophies" className="py-20 bg-[#070b12] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
            <Trophy className="w-4 h-4 text-amber-400 inline" />
            <span>The Golden Cabinet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
            46 Trophies & Major Awards
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            The most decorated association football player in the 160-year history of the game. Explore the comprehensive collection of international silverware, club trophies, and individual records.
          </p>
        </div>

        {/* Milestone Stat Callouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0a0f19] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400">Total Team Silverware</div>
            <div className="text-3xl font-extrabold font-serif-prestige text-amber-400 mt-1">46</div>
            <div className="text-[11px] text-slate-500 mt-0.5">World record for any footballer</div>
          </div>
          <div className="bg-[#0a0f19] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400">Ballons d’Or</div>
            <div className="text-3xl font-extrabold font-serif-prestige text-amber-300 mt-1">8</div>
            <div className="text-[11px] text-slate-500 mt-0.5">2009, ’10, ’11, ’12, ’15, ’19, ’21, ’23</div>
          </div>
          <div className="bg-[#0a0f19] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400">European Golden Shoes</div>
            <div className="text-3xl font-extrabold font-serif-prestige text-sky-400 mt-1">6</div>
            <div className="text-[11px] text-slate-500 mt-0.5">All-time record across Europe</div>
          </div>
          <div className="bg-[#0a0f19] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-400">World Cup Golden Balls</div>
            <div className="text-3xl font-extrabold font-serif-prestige text-emerald-400 mt-1">2</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Only player to win twice (2014, 2022)</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-[#090e18] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter trophies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080d16] text-xs text-slate-200 placeholder-slate-500 rounded pl-8 pr-3 py-1.5 border border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            />
          </div>
        </div>

        {/* Trophies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrophies.map((trophy) => (
            <div
              key={trophy.id}
              onClick={() => handleSelectTrophy(trophy)}
              className="group cursor-pointer bg-[#090e18] hover:bg-[#0c1322] p-6 rounded-lg border border-slate-800 hover:border-amber-400/50 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {trophy.team}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                    <Trophy className="w-3 h-3" />
                    <span>{trophy.count}x</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-serif-prestige text-white group-hover:text-amber-400 transition-colors">
                  {trophy.name}
                </h3>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-light">
                  {trophy.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-1">
                  Years Won:
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] font-mono text-amber-300">
                  {trophy.years.map((y, idx) => (
                    <span key={idx}>
                      {y}{idx < trophy.years.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-xs text-sky-400 flex items-center justify-between">
                  <span className="font-medium text-[11px] truncate">{trophy.highlightDetail}</span>
                  <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for active trophy details */}
        {activeTrophy && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trophy-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveTrophy(null)}
          >
            <div
              className="bg-[#0c121d] border border-amber-400/40 rounded-lg max-w-lg w-full p-6 sm:p-8 text-left shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  {activeTrophy.team} · Silverware Archive
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTrophy(null)}
                  className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 id="trophy-title" className="text-2xl font-bold font-serif-prestige text-white">
                      {activeTrophy.name}
                    </h3>
                    <div className="text-xs font-mono text-amber-400 font-bold">
                      {activeTrophy.count} Titles Won
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                  {activeTrophy.description}
                </p>

                <div className="mt-4 p-4 bg-slate-900/60 rounded border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase">Historical Significance:</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {activeTrophy.significance}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-mono text-slate-400 uppercase mb-1">
                    Featured Edition ({activeTrophy.highlightYear}):
                  </div>
                  <p className="text-xs font-mono text-amber-300 font-medium">
                    {activeTrophy.highlightDetail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  All Winning Years: {activeTrophy.years.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
