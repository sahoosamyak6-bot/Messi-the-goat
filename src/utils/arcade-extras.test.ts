import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryReducer, memoryTrophies, moveTimelineItem, newMemoryRound, shuffleItems, timelineCorrectCount, timelineMilestones } from './arcade-extras';

test('shuffle preserves all entries without mutating its input', () => {
  const original = [1, 2, 3, 4];
  for (const sample of [0, .5, 1, -1, NaN, Infinity]) {
    const shuffled = shuffleItems(original, () => sample);
    assert.deepEqual([...shuffled].sort(), original);
    assert.notEqual(shuffled, original);
  }
  assert.deepEqual(original, [1, 2, 3, 4]);
});
test('memory begins with exactly two cards per trophy and eight unique card ids', () => {
  const state = newMemoryRound();
  assert.equal(state.cards.length, 8);
  assert.equal(new Set(state.cards.map(card => card.id)).size, 8);
  for (const trophy of memoryTrophies) assert.equal(state.cards.filter(card => card.trophy.id === trophy.id).length, 2);
  assert.deepEqual(state.revealed, []);
  assert.deepEqual(state.matched, []);
  assert.equal(state.turns, 0);
});
test('memory ignores repeat flips, invalid cards and third cards before continuing', () => {
  let state = newMemoryRound(() => 0);
  const first = state.cards[0];
  const second = state.cards.find(card => card.trophy.id !== first.trophy.id)!;
  state = memoryReducer(state, { type: 'flip', id: first.id });
  assert.equal(memoryReducer(state, { type: 'flip', id: first.id }), state);
  assert.equal(memoryReducer(state, { type: 'flip', id: 'missing' }), state);
  assert.equal(memoryReducer(state, { type: 'continue' }), state);
  state = memoryReducer(state, { type: 'flip', id: second.id });
  assert.equal(state.turns, 1);
  assert.equal(state.matched.length, 0);
  assert.equal(memoryReducer(state, { type: 'flip', id: state.cards[2].id }), state);
  state = memoryReducer(state, { type: 'continue' });
  assert.equal(state.revealed.length, 0);
  assert.equal(state.turns, 1);
});
test('all four memory pairs can be completed once and restart clears everything', () => {
  let state = newMemoryRound(() => .5);
  for (const trophy of memoryTrophies) {
    const pair = state.cards.filter(card => card.trophy.id === trophy.id);
    for (const card of pair) state = memoryReducer(state, { type: 'flip', id: card.id });
    assert.ok(pair.every(card => state.matched.includes(card.id)));
    state = memoryReducer(state, { type: 'continue' });
    assert.equal(memoryReducer(state, { type: 'flip', id: pair[0].id }), state);
  }
  assert.equal(state.matched.length, 8);
  assert.equal(state.turns, 4);
  const cards = newMemoryRound().cards;
  assert.deepEqual(memoryReducer(state, { type: 'reset', cards }), { cards, revealed: [], matched: [], turns: 0 });
});
test('timeline order is chronological and source-backed', () => {
  assert.equal(timelineMilestones.length, 5);
  assert.deepEqual(timelineMilestones.map(x => x.date), timelineMilestones.map(x => x.date).sort());
  for (const milestone of timelineMilestones) assert.ok(milestone.source.url.startsWith('https://'));
  const ids = timelineMilestones.map(x => x.id);
  assert.equal(timelineCorrectCount(ids), 5);
  assert.equal(timelineCorrectCount([...ids].reverse()), 1);
  assert.equal(timelineCorrectCount(Array(5).fill(ids[0])), 0);
  assert.equal(timelineCorrectCount(ids.slice(0, 4)), 0);
  assert.equal(timelineCorrectCount([...ids.slice(0, 4), 'unknown']), 0);
});
test('timeline moves preserve every milestone and reject invalid bounds', () => {
  const ids = timelineMilestones.map(x => x.id);
  assert.deepEqual(moveTimelineItem(ids, 0, 1), [ids[1], ids[0], ...ids.slice(2)]);
  assert.deepEqual(moveTimelineItem(moveTimelineItem(ids, 0, 4), 4, 0), ids);
  for (const [from, to] of [[-1, 0], [0, 5], [NaN, 1], [1, 1], [0, .5]]) assert.deepEqual(moveTimelineItem(ids, from, to), ids);
  assert.equal(timelineCorrectCount(ids), 5);
});
