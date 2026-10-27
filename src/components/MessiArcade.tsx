import { useCallback, useEffect, useRef, useState } from 'react';
import { eraClues, newPenaltyRound, parseRecord, reactionDelay, reactionMilliseconds, takePenalty, triviaQuestions, type Direction } from '../utils/arcade';
import { MemoryGame, TimelineGame } from './ArcadeExtras';
import './messi-arcade.css';

function useLocalRecord(key: string, maximum: number, lowerIsBetter = false) {
  const [best, setBest] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    try { setBest(parseRecord(localStorage.getItem(key), maximum, lowerIsBetter ? 1 : 0)); }
    catch { setUnavailable(true); }
  }, [key, maximum, lowerIsBetter]);
  const save = (value: number) => {
    const next = best === null ? value : lowerIsBetter ? Math.min(best, value) : Math.max(best, value);
    setBest(next);
    try { localStorage.setItem(key, String(next)); } catch { setUnavailable(true); }
  };
  return { best, save, unavailable };
}

function PenaltyGame() {
  const [round, setRound] = useState(newPenaltyRound);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const shoot = (direction: Direction) => {
    if (locked.current || round.shots >= 5) return;
    locked.current = true;
    setBusy(true);
    const keeper = Math.floor(Math.random() * 3) as Direction;
    setRound(previous => takePenalty(previous, direction, keeper));
    timer.current = setTimeout(() => { locked.current = false; setBusy(false); }, 500);
  };
  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    locked.current = false;
    setBusy(false);
    setRound(newPenaltyRound());
  };
  const directions = ['Left', 'Centre', 'Right'];
  const feedback = round.shots === 0 ? 'Choose a direction to take your first shot.' : `${round.shot === round.keeper ? 'Saved!' : 'Goal!'} Keeper went ${directions[round.keeper!].toLowerCase()}. ${round.shots === 5 ? `Round complete: ${round.goals} of 5 goals.` : `${5 - round.shots} shots remaining.`}`;
  return <article className="arcade-card" aria-labelledby="penalty-title">
    <p className="arcade-kicker"><span aria-hidden="true">⚽</span> GAME 01 · CHANCE & CHOICE</p>
    <h3 id="penalty-title">Penalty shootout</h3>
    <p>Pick your spot. Five shots, one keeper. The keeper chooses randomly — can you beat them?</p>
    <div className="arcade-scoreboard"><span>Goals <strong>{round.goals}</strong></span><span>Shots left <strong>{5 - round.shots}</strong></span></div>
    <div className="arcade-pitch" aria-hidden="true">
      <div className="arcade-goal"><span className="arcade-keeper" style={{ left: `${[17, 50, 83][round.keeper ?? 1]}%` }}>🧤</span></div>
      <span className={`arcade-ball${round.shots ? ' is-shot' : ''}`} style={{ left: `${round.shots ? [24, 50, 76][round.shot!] : 50}%` }}>⚽</span>
      <span className="arcade-pitch-label">THE PENALTY SPOT</span>
    </div>
    <div className="arcade-directions" role="group" aria-label="Choose shot direction">{directions.map((direction, index) => <button key={direction} type="button" disabled={busy || round.shots >= 5} onKeyDown={event => { if (event.repeat) event.preventDefault(); }} onClick={() => shoot(index as Direction)}><span aria-hidden="true">{['↖', '↑', '↗'][index]}</span> {direction}</button>)}</div>
    <p className="arcade-feedback" role="status" aria-atomic="true">{feedback}</p>
    <button className="arcade-reset" type="button" onClick={reset}>Play again · Reset shots</button>
  </article>;
}

function TriviaGame() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const record = useLocalRecord('messi-arcade-trivia-v1', triviaQuestions.length);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const selected = answers[index];
  const question = triviaQuestions[index];
  const score = answers.reduce((total, answer, i) => total + Number(answer === triviaQuestions[i].correctIndex), 0);
  const answer = (choice: number) => {
    setAnswers(previous => previous.length !== index || complete ? previous : [...previous, choice]);
  };
  useEffect(() => { if (selected !== undefined) feedback.current?.focus({ preventScroll: true }); }, [selected]);
  const next = () => {
    if (selected === undefined || complete) return;
    if (index === triviaQuestions.length - 1) { setComplete(true); record.save(score); }
    else setIndex(index + 1);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };
  const reset = () => {
    setIndex(0); setAnswers([]); setComplete(false);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };
  return <article className="arcade-card" aria-labelledby="arcade-trivia-title">
    <p className="arcade-kicker"><span aria-hidden="true">🧠</span> GAME 02 · KNOW THE LEGEND</p>
    <h3 id="arcade-trivia-title">Messi trivia</h3>
    <p>Eight historical questions. One point for each correct first answer. Take your time.</p>
    <div className="arcade-scoreboard"><span>{complete ? 'Complete' : `Question ${index + 1} / 8`}</span><span>Score <strong>{score}</strong></span></div>
    <h4 className="arcade-question" ref={heading} tabIndex={-1} id="arcade-question">{complete ? `Full time: ${score} / 8` : question.question}</h4>
    {!complete && <><div className="arcade-answers" role="group" aria-labelledby="arcade-question">{question.options.map((option, optionIndex) => <button type="button" key={option} disabled={selected !== undefined} className={selected !== undefined && optionIndex === question.correctIndex ? 'is-correct' : selected === optionIndex ? 'is-incorrect' : ''} onClick={() => answer(optionIndex)}>{option}{selected !== undefined && optionIndex === question.correctIndex ? ' ✓ Correct' : selected === optionIndex ? ' — Your answer' : ''}</button>)}</div>
      <p className="arcade-feedback" role="status" ref={feedback} tabIndex={-1}>{selected === undefined ? 'Choose one answer.' : `${selected === question.correctIndex ? 'Correct!' : 'Not this time.'} ${question.explanation}`}</p>
      {selected !== undefined && <><a className="arcade-source" href={question.sourceUrl} target="_blank" rel="noreferrer">{question.sourceLabel} ↗ (new tab)</a><button type="button" className="arcade-primary" onClick={next}>{index === 7 ? 'See result' : 'Next question'}</button></>}
    </>}
    {complete && <p className="arcade-feedback" role="status">{score === 8 ? 'Perfect round. A true archive expert!' : 'Nice round. Explore the archive and try again.'}</p>}
    <button className="arcade-reset" type="button" onClick={reset}>Restart arcade quiz</button>
    <p className="arcade-record">Personal best: {record.best ?? '—'} / 8 · {record.unavailable ? 'Storage unavailable; records last for this visit.' : 'Saved in this browser only.'}</p>
  </article>;
}

function EraGame() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (answer !== null) feedback.current?.focus({ preventScroll: true }); }, [answer]);
  const clue = eraClues[index];
  return <article className="arcade-card" aria-labelledby="era-title">
    <p className="arcade-kicker"><span aria-hidden="true">🔎</span> GAME 03 · READ THE CLUES</p>
    <h3 id="era-title">Guess the era</h3>
    <p>Find the club, country or chapter behind each clue. No timer, just football memories.</p>
    <div className="arcade-scoreboard"><span>Clue {index + 1} / {eraClues.length}</span><span>THE CAREER FILES</span></div>
    <h4 className="arcade-question" ref={heading} tabIndex={-1} id="era-question">{clue.question}</h4>
    <div className="arcade-answers" role="group" aria-labelledby="era-question">{clue.options.map((option, choice) => <button type="button" key={option} disabled={answer !== null} className={answer !== null && choice === clue.correctIndex ? 'is-correct' : answer === choice ? 'is-incorrect' : ''} onClick={() => setAnswer(previous => previous === null ? choice : previous)}>{option}{answer !== null && choice === clue.correctIndex ? ' ✓ Correct' : answer === choice ? ' — Your answer' : ''}</button>)}</div>
    <p className="arcade-feedback" role="status" ref={feedback} tabIndex={-1}>{answer === null ? 'Which chapter is it?' : answer === clue.correctIndex ? 'Correct! You know your Messi history.' : `The answer is ${clue.options[clue.correctIndex]}. Keep exploring!`}</p>
    <button className="arcade-reset" type="button" onClick={() => { setIndex((index + 1) % eraClues.length); setAnswer(null); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); }}>{index === eraClues.length - 1 ? 'Back to first clue' : 'Next clue'}</button>
  </article>;
}

type ReactionPhase = 'idle' | 'waiting' | 'ready' | 'result';
function ReactionGame() {
  const [phase, setPhase] = useState<ReactionPhase>('idle');
  const [message, setMessage] = useState('Press Start when you are ready.');
  const phaseRef = useRef<ReactionPhase>('idle');
  const signalTime = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const card = useRef<HTMLElement>(null);
  const target = useRef<HTMLButtonElement>(null);
  const record = useLocalRecord('messi-arcade-reaction-v1', 60000, true);
  const changePhase = (next: ReactionPhase) => { phaseRef.current = next; setPhase(next); };
  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (phaseRef.current === 'waiting' || phaseRef.current === 'ready') {
      phaseRef.current = 'idle'; setPhase('idle'); setMessage('Round cancelled. Press Start for a fresh attempt.');
    }
  }, []);
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) cancel(); };
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) cancel(); });
    if (card.current) observer.observe(card.current);
    return () => { document.removeEventListener('visibilitychange', onVisibility); observer.disconnect(); if (timer.current) clearTimeout(timer.current); };
  }, [cancel]);
  const start = () => {
    if (phaseRef.current === 'waiting' || phaseRef.current === 'ready') return;
    changePhase('waiting'); setMessage('Wait for green and “GO!” — do not press yet.');
    target.current?.focus({ preventScroll: true });
    timer.current = setTimeout(() => {
      signalTime.current = performance.now(); changePhase('ready'); setMessage('GO! Tap or press now!');
    }, reactionDelay(Math.random()));
  };
  const react = () => {
    if (phaseRef.current === 'waiting') {
      if (timer.current) clearTimeout(timer.current);
      changePhase('result'); setMessage('Too soon! Wait for green before pressing. Try again.');
    } else if (phaseRef.current === 'ready') {
      const elapsed = reactionMilliseconds(signalTime.current, performance.now());
      changePhase('result');
      setMessage(elapsed === null ? 'Attempt expired. Start a new round.' : `${elapsed} ms. Nice reaction! Try to beat your time.`);
      if (elapsed !== null) record.save(elapsed);
    }
  };
  return <article className="arcade-card" aria-labelledby="reaction-title" ref={card} onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) cancel(); }} onKeyDown={event => { if (event.key === 'Escape') cancel(); }}>
    <p className="arcade-kicker"><span aria-hidden="true">⚡</span> GAME 04 · QUICK OFF THE MARK</p>
    <h3 id="reaction-title">Reaction challenge</h3>
    <p>Wait for green and “GO!”, then tap the pad or press Space / Enter. A false start ends the attempt.</p>
    <button ref={target} type="button" className={`arcade-reaction is-${phase}`} aria-disabled={phase === 'idle' || phase === 'result'} onPointerDown={event => { if (event.isPrimary && event.button === 0) { event.preventDefault(); target.current?.focus({ preventScroll: true }); react(); } }} onClick={event => { if (event.detail === 0) react(); }} onKeyDown={event => { if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) react(); } }}><span aria-hidden="true">{phase === 'ready' ? '⚡' : phase === 'waiting' ? '◷' : '◎'}</span><strong>{phase === 'ready' ? 'GO!' : phase === 'waiting' ? 'Wait…' : phase === 'result' ? 'Try another round' : 'Ready when you are'}</strong></button>
    <p className="arcade-feedback" role="status" aria-atomic="true">{message}</p>
    <div className="arcade-actions"><button type="button" className="arcade-primary" disabled={phase === 'waiting' || phase === 'ready'} onClick={start}>Start reaction round</button><button type="button" className="arcade-reset" disabled={phase !== 'waiting' && phase !== 'ready'} onClick={cancel}>Cancel round</button></div>
    <p className="arcade-record">Best: {record.best === null ? 'No time yet' : `${record.best} ms`} · {record.unavailable ? 'Storage unavailable; records last for this visit.' : 'Saved in this browser only.'}</p>
    <p className="arcade-note">For fun, not a scientific test. Device and input delays affect results. Escape, moving focus away, scrolling past this card or hiding the tab cancels the round.</p>
  </article>;
}

export function MessiArcade() {
  return <section id="games" className="messi-arcade section-anchor" aria-labelledby="arcade-title">
    <div className="arcade-container"><header className="arcade-heading"><div><p className="arcade-kicker">THE MESSI ARCADE · SIX WAYS TO PLAY</p><h2 id="arcade-title">Your turn,<br /><em>number ten.</em></h2></div><p>A little football magic, in your hands. Take a shot, test your knowledge and chase your own best — no account, no leaderboard, just play.</p></header>
      <div className="arcade-grid"><PenaltyGame /><TriviaGame /><EraGame /><ReactionGame /><MemoryGame /><TimelineGame /></div>
      <p className="arcade-footnote">All games run on your device. Personal records are local to this browser, not shared online. The original GOAT Trivia Challenge remains in the Quotes & Trivia section.</p>
    </div>
  </section>;
}
