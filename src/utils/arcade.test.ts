import test from 'node:test';
import assert from 'node:assert/strict';
import { eraClues, newPenaltyRound, parseRecord, reactionDelay, reactionMilliseconds, takePenalty, triviaQuestions, type Direction } from './arcade';
import { QUIZ_QUESTIONS } from '../data/quiz-questions';

test('arcade trivia reuses eight sourced archive questions without changing the original quiz', () => {
  assert.equal(triviaQuestions.length, 8);
  assert.ok(QUIZ_QUESTIONS.length > triviaQuestions.length);
  for (const question of triviaQuestions) {
    assert.ok(question.sourceUrl.startsWith('https://'));
    assert.ok(question.options[question.correctIndex]);
    assert.ok(question.explanation);
  }
});
test('era clues each offer exactly one valid answer and distinct choices', () => {
  assert.ok(eraClues.length >= 4);
  for (const clue of eraClues) {
    assert.equal(new Set(clue.options).size, clue.options.length);
    assert.ok(clue.options[clue.correctIndex]);
  }
});
test('each shot/keeper combination scores only when the keeper misses', () => {
  for (const shot of [0, 1, 2] as Direction[]) for (const keeper of [0, 1, 2] as Direction[]) {
    const initial = newPenaltyRound();
    const next = takePenalty(initial, shot, keeper);
    assert.equal(next.goals, Number(shot !== keeper));
    assert.equal(next.shots, 1);
    assert.equal(initial.shots, 0);
  }
});
test('penalty rounds stop at five shots and reset without leaking state', () => {
  let round = newPenaltyRound();
  for (let i = 0; i < 20; i++) round = takePenalty(round, 0, 1);
  assert.equal(round.shots, 5);
  assert.equal(round.goals, 5);
  assert.equal(takePenalty(round, 1, 1), round);
  assert.deepEqual(newPenaltyRound(), { shots: 0, goals: 0, shot: null, keeper: null });
  assert.equal(takePenalty(round, 99 as Direction, 0), round);
});
test('malformed or out-of-range stored personal records are ignored', () => {
  for (const value of [null, '', ' ', 'NaN', 'Infinity', '-1', '9', '1.5', '{}']) assert.equal(parseRecord(value, 8), null);
  assert.equal(parseRecord('0', 8), 0);
  assert.equal(parseRecord('8', 8), 8);
  assert.equal(parseRecord('0', 60000, 1), null);
  assert.equal(parseRecord('250', 60000, 1), 250);
  assert.equal(parseRecord('60001', 60000, 1), null);
});
test('reaction waits are bounded even for invalid randomness', () => {
  for (const value of [-100, 0, .3, .99, 1, 100, NaN, Infinity]) {
    const delay = reactionDelay(value);
    assert.ok(Number.isInteger(delay) && delay >= 1500 && delay <= 4000);
  }
});
test('reaction timing rejects invalid, nonpositive and expired attempts', () => {
  assert.equal(reactionMilliseconds(100, 350), 250);
  assert.equal(reactionMilliseconds(100, 350.2), 250);
  for (const end of [0, 100, 100.2, Infinity, NaN, 60101]) assert.equal(reactionMilliseconds(100, end), null);
});

test('arcade controls preserve mobile, keyboard and interruption guards', async () => {
  const { readFileSync } = await import('node:fs');
  const component = readFileSync('src/components/MessiArcade.tsx', 'utf8');
  const css = readFileSync('src/components/messi-arcade.css', 'utf8');
  assert.match(component, /visibilitychange/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /event\.repeat/);
  assert.match(component, /Escape/);
  assert.match(component, /aria-atomic="true"/);
  assert.match(component, /Storage unavailable/);
  assert.match(css, /min-height: 46px/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
});
