import { useEffect, useRef, useState } from 'react';
import { ArcadeShareResult } from './ArcadeShareResult';
import { dailyQuestion, localDateKey, parseDailyAttempt, type DailyAttempt } from '../utils/arcade-daily';

const storageKey = 'messi-arcade-daily-v1';
export function ArcadeDaily() {
  const [day, setDay] = useState(localDateKey);
  const [attempt, setAttempt] = useState<DailyAttempt | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const attempts = useRef(new Map<string, DailyAttempt>());
  const feedback = useRef<HTMLParagraphElement>(null);
  const interacted = useRef(false);
  const question = dailyQuestion(day);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'device local time';
  useEffect(() => {
    const refresh = () => {
      const date = localDateKey();
      setDay(date);
      let saved = attempts.current.get(date) ?? null;
      try { saved = parseDailyAttempt(localStorage.getItem(storageKey), date) ?? saved; }
      catch { setUnavailable(true); }
      if (saved) attempts.current.set(date, saved);
      setAttempt(saved);
    };
    refresh();
    const interval = setInterval(refresh, 60000);
    const onVisibility = () => { if (!document.hidden) refresh(); };
    const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) refresh(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('storage', onStorage); };
  }, []);
  useEffect(() => { if (attempt && interacted.current) { feedback.current?.focus({ preventScroll: true }); interacted.current = false; } }, [attempt]);
  const answer = (choice: number) => {
    const today = localDateKey();
    if (today !== day) { setDay(today); setAttempt(attempts.current.get(today) ?? null); return; }
    let previous = attempts.current.get(day) ?? null;
    try { previous = parseDailyAttempt(localStorage.getItem(storageKey), day) ?? previous; }
    catch { setUnavailable(true); }
    if (previous) { setAttempt(previous); return; }
    const next = { date: day, questionId: question.id, choice };
    attempts.current.set(day, next);
    setAttempt(next);
    interacted.current = true;
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setUnavailable(true); }
  };
  return <article id="daily-challenge" className="arcade-card arcade-daily section-anchor" aria-labelledby="daily-title">
    <div><p className="arcade-kicker">TODAY’S EXTRA · ONE QUESTION, ONE FIRST ANSWER</p><h3 id="daily-title">Daily challenge</h3><p className="arcade-daily-date">{day} · {timezone} (your device’s local date)</p><p>A fresh selection each day from our sourced historical questions. Your first answer is saved only in this browser.</p></div>
    <div><h4 id="daily-question" className="arcade-question">{question.question}</h4><div className="arcade-answers" role="group" aria-labelledby="daily-question">{question.options.map((option, index) => <button type="button" key={option} disabled={attempt !== null} className={attempt && index === question.correctIndex ? 'is-correct' : attempt?.choice === index ? 'is-incorrect' : ''} onClick={() => answer(index)}>{option}{attempt && index === question.correctIndex ? ' ✓ Correct' : attempt?.choice === index ? ' — Your answer' : ''}</button>)}</div>
    <p ref={feedback} tabIndex={-1} className="arcade-feedback" role="status">{attempt ? `${attempt.choice === question.correctIndex ? 'Daily challenge: correct!' : 'Daily challenge complete.'} ${question.explanation} Come back tomorrow for another selection.` : 'Choose one answer. There is no timer.'}</p>
    {attempt && <a className="arcade-source" href={question.sourceUrl} target="_blank" rel="noreferrer">{question.sourceLabel} ↗ (new tab)</a>}
    {attempt && <ArcadeShareResult result={`I ${attempt.choice === question.correctIndex ? 'solved' : 'completed'} the Messi Arcade daily challenge for ${day} (${timezone}).`} />}
    <p className="arcade-note">{unavailable ? 'Storage unavailable: your answer is remembered for this visit only.' : 'Clearing browser data and reloading resets your local attempt. This is a casual device-local challenge, not a verified competition.'}</p></div>
  </article>;
}
