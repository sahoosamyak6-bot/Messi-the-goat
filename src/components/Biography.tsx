import React, { useState } from 'react';
import { BIOGRAPHY_CHAPTERS, BiographyChapter } from '../data/messi-data';
import { Calendar, MapPin, Quote, ChevronRight, CheckCircle2, Bookmark, BookOpen, Trophy } from 'lucide-react';
import { soundFx } from '../utils/audio';
import './archive-content.css';

interface BiographyProps {
  externalChapterId?: string;
  externalRequestKey?: number;
}

export const Biography: React.FC<BiographyProps> = ({ externalChapterId, externalRequestKey }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    externalChapterId || BIOGRAPHY_CHAPTERS[0].id
  );
  const [viewMode, setViewMode] = useState<'narrative' | 'summary'>('narrative');

  React.useEffect(() => {
    if (externalChapterId) {
      setSelectedChapterId(externalChapterId);
    }
  }, [externalChapterId, externalRequestKey]);

  const currentChapter = BIOGRAPHY_CHAPTERS.find((c) => c.id === selectedChapterId) || BIOGRAPHY_CHAPTERS[0];

  const handleSelectChapter = (id: string) => {
    soundFx.playClickTone();
    setSelectedChapterId(id);
  };

  return (
    <section id="biography" className="archive-content scroll-mt-24 py-20 bg-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#154284] uppercase mb-3">
            <BookOpen className="w-4 h-4 text-[#154284] inline" />
            <span>Chapter-by-Chapter Biography</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-950">
            The Legend&rsquo;s Odyssey
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            The extraordinary life and career progression of Lionel Andrés Messi — tracing his childhood battles, youth academy miracles, European club dynasties, and the immortal triumph with the Albiceleste.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span>SELECTED ERA:</span>
            <span className="text-[#154284] font-semibold">{currentChapter.eraRange}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-600">{currentChapter.title}</span>
          </div>

          <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setViewMode('narrative');
              }}
              aria-pressed={viewMode === 'narrative'}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'narrative'
                  ? 'bg-[#154284] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Full Detailed Narrative
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setViewMode('summary');
              }}
              aria-pressed={viewMode === 'summary'}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'summary'
                  ? 'bg-[#154284] text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Key Themes & Milestones
            </button>
          </div>
        </div>

        {/* Desktop & Mobile Chapter Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-10">
          {BIOGRAPHY_CHAPTERS.map((chapter, idx) => {
            const isSelected = chapter.id === selectedChapterId;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => handleSelectChapter(chapter.id)}
                aria-pressed={isSelected}
                className={`text-left p-3 rounded-lg transition-all border ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 shadow-md shadow-sky-900/5'
                    : 'bg-white border-sky-100 hover:border-sky-200 hover:bg-sky-50/70'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
                  Part 0{idx + 1}
                </div>
                <div className={`text-xs font-bold font-sans mt-1 truncate ${
                  isSelected ? 'text-[#154284]' : 'text-slate-800'
                }`}>
                  {chapter.eraRange}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                  {chapter.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chapter Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-sm">
            {/* Header info */}
            <div className="border-b border-sky-100 pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-2">
                <span className="flex items-center gap-1 text-[#154284] font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentChapter.eraRange}
                </span>
                <span className="text-slate-500">·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  {currentChapter.location}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-950 tracking-tight">
                {currentChapter.title}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-sky-800 font-normal italic">
                {currentChapter.tagline}
              </p>
            </div>

            {/* Content view modes */}
            {viewMode === 'narrative' ? (
              <div className="space-y-5 text-slate-600 text-base leading-relaxed font-normal">
                {currentChapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="first-letter:text-2xl first-letter:font-sans first-letter:text-[#154284]">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3">
                    Core Themes of this Era
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentChapter.keyThemes.map((theme, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-sky-50/70 border border-sky-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#154284] shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-800 font-medium">{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-sky-50/60 rounded-lg border border-sky-100">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-2">
                    Executive Summary
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentChapter.content[0]}
                  </p>
                </div>
              </div>
            )}

            {/* Chapter Quote if available */}
            {currentChapter.keyQuote && (
              <div className="mt-8 pt-6 border-t border-sky-100 bg-sky-50/70 p-4 rounded-lg border-l-2 border-l-[#a50044]">
                <div className="flex gap-3">
                  <Quote className="w-5 h-5 text-[#154284] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm italic text-slate-800">
                      &ldquo;{currentChapter.keyQuote.text}&rdquo;
                    </p>
                    <p className="mt-1 text-xs font-mono text-[#154284]">
                      — {currentChapter.keyQuote.author}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons to next chapter */}
            <div className="mt-8 pt-6 border-t border-sky-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Chapter {BIOGRAPHY_CHAPTERS.findIndex(c => c.id === currentChapter.id) + 1} of {BIOGRAPHY_CHAPTERS.length}
              </span>

              {BIOGRAPHY_CHAPTERS.findIndex(c => c.id === currentChapter.id) < BIOGRAPHY_CHAPTERS.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = BIOGRAPHY_CHAPTERS.findIndex(c => c.id === currentChapter.id);
                    handleSelectChapter(BIOGRAPHY_CHAPTERS[currentIndex + 1].id);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#154284] hover:text-[#154284] transition-colors"
                >
                  <span>Next Era</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Chapter Sidebar / Key Stats Callout (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Metric highlight card */}
            {currentChapter.metricsHighlight && (
              <div className="bg-white p-6 rounded-2xl border border-sky-100">
                <div className="text-xs font-mono uppercase tracking-wider text-[#154284] mb-1">
                  {currentChapter.metricsHighlight.label}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-950 tracking-tight">
                  {currentChapter.metricsHighlight.value}
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {currentChapter.metricsHighlight.sublabel}
                </p>
              </div>
            )}

            {/* Career Context Card */}
            <div className="bg-white p-6 rounded-2xl border border-sky-100">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-4 flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-sky-700" />
                Historical Significance
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#154284] mt-1.5 shrink-0" />
                  <span>Grandmother Celia inspired his iconic skyward goal tribute, which he preserves to this day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#154284] mt-1.5 shrink-0" />
                  <span>The napkin agreement signed by Charly Rexach is preserved as a UNESCO candidate sporting relic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#154284] mt-1.5 shrink-0" />
                  <span>Guardiola’s False Nine tactical shift in 2009 redefined the geometry of modern attacking football.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#154284] mt-1.5 shrink-0" />
                  <span>Only player in history to win two World Cup Golden Balls (2014 & 2022).</span>
                </li>
              </ul>
            </div>

            {/* Club and National Journey Quick Overview */}
            <div className="bg-white p-6 rounded-2xl border border-sky-100">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-[#154284]" />
                Teams Represented
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-sky-100">
                  <span className="font-semibold text-slate-800">FC Barcelona</span>
                  <span className="text-slate-600 font-mono">2004 – 2021 (778 apps)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-100">
                  <span className="font-semibold text-slate-800">Paris Saint-Germain</span>
                  <span className="text-slate-600 font-mono">2021 – 2023 (75 apps)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-100">
                  <span className="font-semibold text-slate-800">Inter Miami CF</span>
                  <span className="text-slate-600 font-mono">2023 – Present (48+ apps)</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="font-semibold text-sky-700">Argentina National Team</span>
                  <span className="text-slate-600 font-mono">2005 – Present (191+ apps)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
