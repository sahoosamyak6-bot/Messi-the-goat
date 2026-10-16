import React, { useState, useMemo } from 'react';
import { ICONIC_MOMENTS, IconicMoment } from '../data/messi-data';
import { Play, Sparkles, ExternalLink, Calendar, MapPin, Quote, Layers, Eye, Filter } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface IconicGalleryProps {
  onSelectMoment: (moment: IconicMoment) => void;
}

export const IconicGallery: React.FC<IconicGalleryProps> = ({ onSelectMoment }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'goal' | 'performance' | 'trophy' | 'celebration'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Iconic Moments' },
    { id: 'goal', label: 'Spectacular Goals' },
    { id: 'performance', label: 'Legendary Masterclasses' },
    { id: 'trophy', label: 'Historic Trophy Lifts' },
    { id: 'celebration', label: 'Immortal Celebrations' },
  ];

  const filteredMoments = useMemo(() => {
    return ICONIC_MOMENTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.year.toString().includes(searchQuery.trim());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenMoment = (moment: IconicMoment) => {
    soundFx.playCelebrationChime();
    onSelectMoment(moment);
  };

  return (
    <section id="gallery" className="py-20 bg-[#070b12] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
            <Sparkles className="w-4 h-4 text-amber-400 inline" />
            <span>Curated Archival Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
            Iconic Moments & Masterpieces
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            From the teenage lob assisted by Ronaldinho to the 91st goal of 2012, the Bernabéu shirt display, and the golden World Cup lift at Lusail.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(cat.id as typeof selectedCategory);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'bg-[#0a0f19] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span>Showing {filteredMoments.length} Iconic Moments</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMoments.map((moment) => (
            <article
              key={moment.id}
              className="group flex flex-col bg-[#090e18] rounded-lg border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all shadow-sm"
            >
              {/* Image banner with overlay */}
              <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  onError={(e) => {
                    // Fallback to high quality alternate soccer asset
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e18] via-transparent to-transparent opacity-90" />

                {/* Floating year / competition kicker */}
                <div className="absolute top-3 left-3 text-xs font-mono text-amber-300 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-amber-400/30">
                  {moment.year} · {moment.competition}
                </div>

                {/* Quick inspect button */}
                <button
                  type="button"
                  onClick={() => handleOpenMoment(moment)}
                  aria-label={`Inspect ${moment.title}`}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Metadata line (Zero-Pill Discipline) */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                    <span>{moment.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-300">{moment.opponent}</span>
                  </div>

                  <h3 className="text-lg font-bold font-serif-prestige text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {moment.title}
                  </h3>

                  <p className="mt-1 text-xs text-sky-400/90 font-light italic">
                    {moment.subtitle}
                  </p>

                  <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {moment.description}
                  </p>
                </div>

                {/* Card Footer: Metrics and Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                    <span className="text-amber-400 font-semibold">{moment.metrics.primary}</span>
                    <span>{moment.metrics.secondary}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMoment(moment)}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      Tactical Analysis
                    </button>

                    <a
                      href={moment.videoQueryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 text-xs font-semibold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Video</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
