import React, { useState } from 'react';
import { LEGEND_QUOTES, TRIVIA_QUESTIONS, LegendQuote, QuizQuestion } from '../data/messi-data';
import { calculateQuizGrade } from '../utils/stats-calculator';
import { Quote, Sparkles, CheckCircle2, XCircle, RotateCcw, Trophy, Award, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

export const QuotesAndTrivia: React.FC = () => {
  // Quotes filter
  const [quoteCategory, setQuoteCategory] = useState<string>('all');

  // Trivia state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Quotes filtering
  const filteredQuotes = quoteCategory === 'all'
    ? LEGEND_QUOTES
    : LEGEND_QUOTES.filter((q) => q.category === quoteCategory);

  // Trivia question handling
  const currentQuestion = TRIVIA_QUESTIONS[currentQIndex];
  const userSelected = selectedAnswers[currentQuestion.id];
  const isAnswered = userSelected !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    soundFx.playBallKick();
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
    setShowExplanation(true);

    if (isCorrect) {
      soundFx.playCelebrationChime();
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClickTone();
    setShowExplanation(false);
    if (currentQIndex < TRIVIA_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#75aadb', '#ffffff', '#eab308'],
        });
      } catch {
        // Fallback
      }
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playClickTone();
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  // Calculate final score
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const question = TRIVIA_QUESTIONS.find((q) => q.id === Number(qId));
    return question && question.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  const grade = calculateQuizGrade(score, TRIVIA_QUESTIONS.length);

  return (
    <section id="trivia-quotes" className="py-20 bg-[#060a10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: VOICES OF THE PANTHEON */}
        <div className="mb-20">
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">
              <MessageSquare className="w-4 h-4 text-amber-400 inline" />
              <span>Voices on the Maestro</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
              The Pantheon on Messi
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              How football&rsquo;s most celebrated managers, adversaries, teammates, and fellow legends attempt to comprehend Lionel Andrés Messi.
            </p>
          </div>

          {/* Quotes category filter */}
          <div className="flex items-center gap-2 flex-wrap mb-8 pb-3 border-b border-slate-800">
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
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  quoteCategory === tab.id
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'bg-[#0a0f19] text-slate-400 hover:text-white border border-slate-800'
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
                className="bg-[#090e18] p-6 rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-6 h-6 text-amber-400/40 mb-3" />
                  <p className="text-sm italic text-slate-200 leading-relaxed font-light">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <div className="text-xs font-bold font-serif-prestige text-amber-400">
                    {q.speaker}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {q.role} {q.year && `(${q.year})`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE GOAT TRIVIA QUIZ */}
        <div className="pt-10 border-t border-slate-800/80">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
              <Sparkles className="w-4 h-4 text-sky-400 inline" />
              <span>Interactive Lore Challenge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
              The GOAT Trivia Challenge
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
              Test your knowledge of Lionel Messi&rsquo;s childhood, career milestones, tactical feats, and legendary lore.
            </p>
          </div>

          {!isCompleted ? (
            /* Quiz Active Card */
            <div className="bg-[#090e18] rounded-lg border border-slate-800 p-6 sm:p-8 max-w-2xl shadow-sm">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 pb-4 border-b border-slate-800">
                <span className="text-amber-400 font-semibold">
                  Question {currentQIndex + 1} of {TRIVIA_QUESTIONS.length}
                </span>
                <span>
                  Current Score: {score} / {currentQIndex + (isAnswered ? 1 : 0)}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold font-serif-prestige text-white mb-6 leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, oIdx) => {
                  let buttonStyle = 'bg-[#0b121f] text-slate-200 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700';

                  if (isAnswered) {
                    if (oIdx === currentQuestion.correctIndex) {
                      buttonStyle = 'bg-emerald-950/40 text-emerald-300 border-emerald-500 font-semibold';
                    } else if (oIdx === userSelected) {
                      buttonStyle = 'bg-rose-950/40 text-rose-300 border-rose-500';
                    } else {
                      buttonStyle = 'bg-[#080d16] text-slate-600 border-slate-900 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && oIdx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && oIdx === userSelected && oIdx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {isAnswered && (
                <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                    Historical Context:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-end">
                {isAnswered && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs tracking-wide rounded transition-colors"
                  >
                    {currentQIndex < TRIVIA_QUESTIONS.length - 1 ? 'Next Question →' : 'View Results'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="bg-[#090e18] rounded-lg border border-amber-400/40 p-8 sm:p-10 max-w-2xl text-center shadow-lg">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                Lore Challenge Complete
              </div>

              <h3 className="text-3xl font-extrabold font-serif-prestige text-white">
                {grade.title}
              </h3>

              <div className="mt-2 text-sm font-semibold text-sky-400 font-mono">
                {grade.badge}
              </div>

              <p className="mt-3 text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                {grade.message}
              </p>

              <div className="mt-6 py-4 px-6 bg-slate-900/70 rounded-lg border border-slate-800 max-w-xs mx-auto">
                <div className="text-xs font-mono text-slate-400">Final Score:</div>
                <div className="text-4xl font-extrabold font-serif-prestige text-amber-400 mt-1">
                  {score} / {TRIVIA_QUESTIONS.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  {Math.round((score / TRIVIA_QUESTIONS.length) * 100)}% Accuracy
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
