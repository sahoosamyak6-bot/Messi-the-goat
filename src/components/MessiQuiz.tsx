import { useEffect, useReducer, useRef } from 'react';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { questionsForDifficulty, type QuizDifficulty } from '../data/quiz-questions';
import { createQuizState, quizReducer, quizScore } from '../utils/quiz-model';
import { calculateQuizGrade } from '../utils/stats-calculator';

export function MessiQuiz() {
  const [state, dispatch] = useReducer(quizReducer, undefined, () => createQuizState());
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);
  const questions = questionsForDifficulty(state.difficulty);
  const question = questions[state.index];
  const selected = state.answers[question.id];
  const answered = selected !== undefined;
  const score = quizScore(state);
  const grade = calculateQuizGrade(score, questions.length);
  useEffect(() => {
    if (hasInteracted.current) heading.current?.focus({ preventScroll: true });
  }, [state.index, state.completed, state.attempt]);
  useEffect(() => {
    if (answered && !state.completed) feedback.current?.focus({ preventScroll: true });
  }, [answered, state.completed, question.id]);
  return <div className="pt-10 border-t border-sky-100" id="messi-quiz">
    <div className="max-w-3xl mb-8">
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-700 uppercase mb-3"><Sparkles className="w-4 h-4" aria-hidden="true" />Interactive Lore Challenge</div>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">The GOAT Trivia Challenge</h2>
      <p className="mt-2 text-slate-600 text-sm sm:text-base">Three difficulty levels. Four questions each. One point per correct first answer, no timer and no penalties. Historical facts, with official sources.</p>
    </div>
    <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 max-w-2xl shadow-sm">
      <label className="block font-semibold text-slate-800 mb-2" htmlFor="quiz-difficulty">Difficulty</label>
      <select id="quiz-difficulty" value={state.difficulty} onChange={event => { hasInteracted.current = true; dispatch({ type: 'difficulty', difficulty: event.target.value as QuizDifficulty }); }} className="border border-sky-200 rounded-lg p-3 text-slate-900 bg-white w-full sm:w-auto" aria-describedby="quiz-reset-notice">
        <option value="easy">Easy · The essentials</option><option value="medium">Medium · Match memories</option><option value="hard">Hard · Archive expert</option>
      </select>
      <p id="quiz-reset-notice" className="text-xs text-slate-600 mt-2 mb-6">Changing difficulty starts a fresh attempt. Scores stay in this visit only; there is no global leaderboard.</p>
      {state.completed ? <>
        <Trophy className="w-10 h-10 text-sky-700 mb-3" aria-hidden="true" />
        <h3 ref={heading} tabIndex={-1} className="text-2xl font-bold text-slate-950">Quiz complete: {score} / {questions.length}</h3>
        <p className="mt-2 text-slate-700">{Math.round(score / questions.length * 100)}% accuracy · {state.difficulty} difficulty</p>
        <p className="mt-2 text-slate-700">{grade.title} — {grade.message}</p>
        <details className="mt-5"><summary className="cursor-pointer font-semibold text-sky-800">Review your answers</summary><ol className="mt-3 space-y-4 list-decimal pl-5">{questions.map(item => <li key={item.id} className="text-sm text-slate-700"><p className="font-semibold">{item.question}</p><p>Your answer: {item.options[state.answers[item.id]]} — {state.answers[item.id] === item.correctIndex ? 'Correct' : 'Incorrect'}</p><p>Correct answer: {item.options[item.correctIndex]}</p><a className="underline text-sky-800" href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel} (new tab)</a></li>)}</ol></details>
      </> : <>
        <p className="text-sm text-slate-600 mb-4">Question {state.index + 1} of {questions.length} · Score: {score} / {Object.keys(state.answers).length} answered</p>
        <h3 ref={heading} tabIndex={-1} id="quiz-question" className="text-xl font-bold text-slate-950 mb-5">{question.question}</h3>
        <div className="space-y-3" role="group" aria-labelledby="quiz-question">{question.options.map((option, index) => <button key={option} type="button" disabled={answered} onClick={() => { hasInteracted.current = true; dispatch({ type: 'answer', questionId: question.id, option: index }); }} className={`w-full text-left p-4 rounded-xl border text-sm font-medium ${answered && index === question.correctIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : answered && index === selected ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-white border-sky-200 text-slate-800 enabled:hover:bg-sky-50'}`}>
          {option}{answered && index === question.correctIndex ? ' — Correct answer' : answered && index === selected ? ' — Your answer' : ''}
        </button>)}</div>
        <div role="status" aria-live="polite" aria-atomic="true">{answered && <div ref={feedback} tabIndex={-1} className="mt-5 p-4 bg-sky-50 rounded-xl text-sm text-slate-800"><p className="font-bold">{selected === question.correctIndex ? 'Correct! One point earned.' : 'Not quite. No point this time.'}</p><p className="mt-1">{question.explanation}</p><a className="inline-block mt-2 underline text-sky-800" href={question.sourceUrl} target="_blank" rel="noreferrer">{question.sourceLabel} (new tab)</a></div>}</div>
        {answered && <button type="button" onClick={() => dispatch({ type: 'next', questionId: question.id })} className="mt-5 px-5 py-3 bg-[#154284] text-white rounded-lg font-semibold">{state.index === questions.length - 1 ? 'View results' : 'Next question'}</button>}
      </>}
      <button type="button" onClick={() => { hasInteracted.current = true; dispatch({ type: 'restart' }); }} className="flex items-center gap-2 mt-6 px-4 py-3 rounded-lg border border-sky-200 text-slate-800 hover:bg-sky-50"><RotateCcw size={16} aria-hidden="true" />{state.completed ? 'Try again' : 'Restart quiz'}</button>
    </div>
  </div>;
}
