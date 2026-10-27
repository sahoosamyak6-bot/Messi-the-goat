import { useEffect, useReducer, useRef, useState } from 'react';
import { ArcadeShareResult } from './ArcadeShareResult';
import { useArcadeRecord } from '../utils/useArcadeRecord';
import { formatMilestoneDate } from '../data/career-milestones';
import { memoryReducer, moveTimelineItem, newMemoryRound, shuffleItems, timelineCorrectCount, timelineMilestones } from '../utils/arcade-extras';

export function MemoryGame() {
  const [state, dispatch] = useReducer(memoryReducer, undefined, () => newMemoryRound());
  const feedback = useRef<HTMLParagraphElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const waiting = state.revealed.length === 2;
  const complete = state.matched.length === state.cards.length;
  const record = useArcadeRecord('messi-arcade-memory-v1', Number.MAX_SAFE_INTEGER, true, 4);
  useEffect(() => { if (complete) record.save(state.turns); }, [complete, state.turns, record.save]);
  const matchedPair = waiting && state.revealed.every(id => state.matched.includes(id));
  useEffect(() => { if (waiting) feedback.current?.focus({ preventScroll: true }); }, [waiting]);
  const focusCard = () => requestAnimationFrame(() => board.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true }));
  return <article id="memory-game" className="arcade-card section-anchor" aria-labelledby="memory-title">
    <p className="arcade-kicker"><span aria-hidden="true">🏆</span> GAME 05 · REMEMBER THE SILVERWARE</p>
    <h3 id="memory-title">Trophy memory match</h3>
    <p>Reveal two cards and find four matching pairs. The symbols are playful illustrations, not official trophy images.</p>
    <div className="arcade-scoreboard"><span>Pairs <strong>{state.matched.length / 2} / 4</strong></span><span>Turns <strong>{state.turns}</strong></span></div>
    <div ref={board} className="arcade-memory-grid" role="group" aria-label="Trophy memory cards">{state.cards.map((card, index) => {
      const matched = state.matched.includes(card.id);
      const visible = matched || state.revealed.includes(card.id);
      return <button type="button" key={card.id} className={`arcade-memory-card${visible ? ' is-revealed' : ''}${matched ? ' is-matched' : ''}`} disabled={visible || waiting} aria-label={`Card ${index + 1}: ${visible ? `${card.trophy.label}${matched ? ', matched' : ''}` : 'face down; reveal'}`} onClick={() => dispatch({ type: 'flip', id: card.id })}><span aria-hidden="true">{visible ? card.trophy.symbol : '?'}</span><strong>{visible ? card.trophy.label : `Card ${index + 1}`}</strong>{matched && <small>✓ Matched</small>}</button>;
    })}</div>
    <p className="arcade-feedback" role="status" aria-atomic="true" ref={feedback} tabIndex={-1}>{complete ? `All four pairs found in ${state.turns} turns. Great memory!` : waiting ? matchedPair ? 'A match! Continue to find the next pair.' : 'Not a match. Take your time to remember them, then continue.' : state.revealed.length ? 'One card revealed. Choose a different card.' : 'Choose any two face-down cards.'}</p>
    <div className="arcade-actions">{waiting && !complete && <button type="button" className="arcade-primary" onClick={() => { dispatch({ type: 'continue' }); focusCard(); }}>Continue matching</button>}<button className="arcade-reset" type="button" onClick={() => { dispatch({ type: 'reset', cards: newMemoryRound().cards }); focusCard(); }}>Shuffle & restart memory</button></div>
    {complete && <ArcadeShareResult result={`I matched all four Messi Arcade trophy pairs in ${state.turns} turns.`} />}
    <p className="arcade-record">Best completed round: {record.best === null ? '—' : `${record.best} turns`} · {record.unavailable ? 'Storage unavailable; records last for this visit.' : 'Saved in this browser only.'}</p>
  </article>;
}

export function TimelineGame() {
  const [order, setOrder] = useState(() => shuffleItems(timelineMilestones.map(item => item.id)));
  const [checked, setChecked] = useState(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const score = timelineCorrectCount(order);
  const record = useArcadeRecord('messi-arcade-timeline-v1', 5);
  useEffect(() => { if (checked) record.save(score); }, [checked, score, record.save]);
  const move = (from: number, to: number) => {
    setOrder(previous => moveTimelineItem(previous, from, to));
    requestAnimationFrame(() => list.current?.querySelector<HTMLElement>(`[data-milestone="${order[from]}"]`)?.focus({ preventScroll: true }));
  };
  return <article id="timeline-game" className="arcade-card section-anchor" aria-labelledby="timeline-game-title">
    <p className="arcade-kicker"><span aria-hidden="true">🗓️</span> GAME 06 · PUT HISTORY IN ORDER</p>
    <h3 id="timeline-game-title">Career timeline challenge</h3>
    <p>Arrange five moments from earliest to latest. Use Up and Down — no dragging needed. Check your order when ready.</p>
    <ol ref={list} className="arcade-timeline-list" aria-label="Career moments, earliest to latest">{order.map((id, index) => {
      const milestone = timelineMilestones.find(item => item.id === id)!;
      const correct = checked && timelineMilestones[index].id === id;
      return <li key={id} data-milestone={id} tabIndex={-1} className={checked ? correct ? 'is-correct' : 'is-incorrect' : ''}><div className="arcade-timeline-copy"><span className="arcade-order-number" aria-hidden="true">{index + 1}</span><strong>{milestone.title}</strong></div>
        {checked ? <div className="arcade-timeline-reveal"><p>{correct ? '✓ Correct position' : `Correct position: ${timelineMilestones.findIndex(item => item.id === id) + 1}`} · {formatMilestoneDate(milestone.date)}</p><a className="arcade-source" href={milestone.source.url} target="_blank" rel="noreferrer">{milestone.source.label} ↗ (new tab)</a></div> : <div className="arcade-timeline-controls"><button type="button" disabled={index === 0} aria-label={`Move ${milestone.title} earlier`} onClick={() => move(index, index - 1)}>↑ Up</button><button type="button" disabled={index === order.length - 1} aria-label={`Move ${milestone.title} later`} onClick={() => move(index, index + 1)}>↓ Down</button></div>}
      </li>;
    })}</ol>
    <p className="arcade-feedback" role="status" aria-atomic="true" ref={feedback} tabIndex={-1}>{checked ? `${score} of 5 moments in the right position. ${score === 5 ? 'A perfectly ordered career!' : 'Dates and correct positions are now revealed. Shuffle for another try.'}` : 'Earliest at the top, latest at the bottom.'}</p>
    <div className="arcade-actions">{!checked && <button className="arcade-primary" type="button" onClick={() => { setChecked(true); requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true })); }}>Check my timeline</button>}<button className="arcade-reset" type="button" onClick={() => { setOrder(shuffleItems(timelineMilestones.map(item => item.id))); setChecked(false); requestAnimationFrame(() => list.current?.querySelector<HTMLElement>('li')?.focus({ preventScroll: true })); }}>Shuffle & restart timeline</button></div>
    {checked && <ArcadeShareResult result={`I placed ${score}/5 career moments correctly in the Messi Arcade timeline challenge.`} />}
    <p className="arcade-record">Personal best: {record.best ?? '—'} / 5 positions · {record.unavailable ? 'Storage unavailable; records last for this visit.' : 'Checked rounds, saved in this browser only.'}</p>
  </article>;
}
