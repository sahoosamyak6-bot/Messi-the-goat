import React, { useState } from 'react';
import { LEGEND_QUOTES } from '../data/messi-data';
import { Quote, MessageSquare } from 'lucide-react';
import { MessiQuiz } from './MessiQuiz';
import { soundFx } from '../utils/audio';
import { GoalPoll } from './GoalPoll';

export const QuotesAndTrivia: React.FC = () => {
  // Quotes filter
  const [quoteCategory, setQuoteCategory] = useState<string>('all');

  // Quotes filtering
  const filteredQuotes = quoteCategory === 'all'
    ? LEGEND_QUOTES
    : LEGEND_QUOTES.filter((q) => q.category === quoteCategory);

  return (
    <section id="trivia-quotes" className="archive-content py-20 bg-sky-50/60 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: VOICES OF THE PANTHEON */}
        <div className="mb-20">
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#154284] uppercase mb-3">
              <MessageSquare className="w-4 h-4 text-[#154284] inline" />
              <span>Voices on the Maestro</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-950">
              The Pantheon on Messi
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              How football&rsquo;s most celebrated managers, adversaries, teammates, and fellow legends attempt to comprehend Lionel Andrés Messi.
            </p>
          </div>

          {/* Quotes category filter */}
          <div className="flex items-center gap-2 flex-wrap mb-8 pb-3 border-b border-sky-100">
            {[
              { id: 'all', label: 'All Voices' },
              { id: 'managers', label: 'Managers' },
              { id: 'legends', label: 'World Cup Champions' },
              { id: 'teammates', label: 'Teammates' },
              { id: 'rivals', label: 'Adversaries' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClickTone();
                  setQuoteCategory(tab.id);
                }}
                aria-pressed={quoteCategory === tab.id}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  quoteCategory === tab.id
                    ? 'bg-[#154284] text-white font-semibold shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-950 border border-sky-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quotes Masonry / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-2xl border border-sky-100 hover:border-sky-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-6 h-6 text-sky-300 mb-3" />
                  <p className="text-sm italic text-slate-800 leading-relaxed font-normal">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sky-100">
                  <div className="text-xs font-bold font-sans text-[#154284]">
                    {q.speaker}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                    {q.role} {q.year && `(${q.year})`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: LIVE FAN GOAL POLL */}
        <GoalPoll />

        <MessiQuiz />
      </div>
    </section>
  );
};
