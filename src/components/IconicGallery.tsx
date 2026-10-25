import React, { useState, useMemo, useId } from 'react';
import { ICONIC_MOMENTS, IconicMoment } from '../data/messi-data';
import { getMomentPhoto } from '../data/moment-photos';
import { getHighlightVideo } from '../data/highlight-videos';
import { Play, Sparkles, Eye, Search, ImageOff } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface IconicGalleryProps {
  onSelectMoment: (moment: IconicMoment) => void;
}

export const IconicGallery: React.FC<IconicGalleryProps> = ({ onSelectMoment }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'goal' | 'performance' | 'trophy' | 'celebration'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const searchId = useId();

  const categories = [
    { id: 'all', label: 'All Iconic Moments' },
    { id: 'goal', label: 'Spectacular Goals' },
    { id: 'performance', label: 'Legendary Masterclasses' },
    { id: 'trophy', label: 'Historic Trophy Lifts' },
    { id: 'celebration', label: 'Immortal Celebrations' },
  ];

  const filteredMoments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ICONIC_MOMENTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery = !query || [item.title, item.opponent, item.competition, String(item.year)]
        .some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenMoment = (moment: IconicMoment) => {
    soundFx.playCelebrationChime();
    onSelectMoment(moment);
  };

  return (
    <section id="gallery" className="py-20 bg-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-700 uppercase mb-3">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Curated Archival Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-slate-950 uppercase">
            Iconic Moments & Masterpieces
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            From the teenage lob assisted by Ronaldinho to the 91st goal of 2012, the Bernabéu shirt display, and the golden World Cup lift at Lusail.
          </p>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Real archive photography sets the scene. Each image is identified below and is not presented as a photograph of the specific moment. Selected official archive videos play here, with source links retained for availability restrictions.
          </p>
        </div>

        <div className="space-y-5 mb-10 pb-5 border-b border-sky-100">
          <div className="flex items-center gap-2 flex-wrap" aria-label="Filter iconic moments">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={selectedCategory === cat.id}
                onClick={() => {
                  soundFx.playClickTone();
                  setSelectedCategory(cat.id as typeof selectedCategory);
                }}
                className={`min-h-10 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-950 border-slate-950 text-white font-semibold shadow-sm'
                    : 'bg-sky-50/60 text-slate-600 hover:text-sky-900 hover:bg-sky-100 border-sky-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <label htmlFor={searchId} className="sr-only">Search iconic moments</label>
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search a moment, opponent or year"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-sky-200 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              />
            </div>
            <p className="text-xs font-mono text-slate-500" role="status">
              Showing {filteredMoments.length} iconic {filteredMoments.length === 1 ? 'moment' : 'moments'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMoments.map((moment) => {
            const { photo, contextLabel } = getMomentPhoto(moment);
            return (
              <article
                key={moment.id}
                className="group flex flex-col bg-white rounded-2xl border border-sky-100 overflow-hidden hover:border-sky-300 transition-colors shadow-sm"
              >
                <figure>
                  <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                    {failedImages.has(photo.src) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center text-sky-100" role="img" aria-label={`Archive photograph unavailable. ${photo.alt}`}>
                        <ImageOff className="w-8 h-8" aria-hidden="true" />
                        <span className="text-sm">Archive photograph unavailable</span>
                        <span className="text-xs text-slate-300">The story and video links are still available below.</span>
                      </div>
                    ) : (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        style={{ objectPosition: photo.objectPosition }}
                        onError={() => setFailedImages((previous) => new Set(previous).add(photo.src))}
                        className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500 motion-reduce:transition-none"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase text-white bg-slate-950/75 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
                      Archive photograph
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenMoment(moment)}
                      aria-label={`Inspect ${moment.title}`}
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-slate-900 hover:bg-sky-100 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <figcaption className="px-5 pt-3 text-[10px] text-slate-500 leading-relaxed">
                    <p>{contextLabel}</p>
                    <p className="mt-1">
                      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-sky-800">{photo.credit}</a>
                      {' · '}
                      <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-sky-800">{photo.license}</a>
                      {' · Optimized; display cropped.'}
                    </p>
                  </figcaption>
                </figure>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-slate-500 mb-2">
                      <span>{moment.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-700">{moment.opponent}</span>
                    </div>
                    <h3 className="text-lg font-bold font-serif-prestige text-slate-950 group-hover:text-sky-800 transition-colors leading-snug">
                      {moment.title}
                    </h3>
                    <p className="mt-1 text-xs text-sky-700 italic">{moment.subtitle}</p>
                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">{moment.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-sky-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono mb-3">
                      <span className="text-sky-800 font-semibold">{moment.metrics.primary}</span>
                      <span>{moment.metrics.secondary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenMoment(moment)}
                        className="flex-1 min-h-10 py-2 px-3 text-xs font-semibold bg-slate-950 hover:bg-sky-950 text-white rounded-lg transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                      >
                        Tactical Analysis
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenMoment(moment)}
                        aria-label={`${getHighlightVideo(moment.id) ? 'Watch inline video' : 'Open video archive'} for ${moment.title}`}
                        className="min-h-10 py-2 px-3 text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg border border-sky-200 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                        <span>{getHighlightVideo(moment.id) ? 'Watch here' : 'Video archive'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {filteredMoments.length === 0 && (
          <div className="py-14 text-center text-slate-600 bg-sky-50 rounded-2xl border border-sky-100">
            <p>No moments match these filters.</p>
            <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-3 text-sm text-sky-800 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-sky-600 rounded">
              Show all moments
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
