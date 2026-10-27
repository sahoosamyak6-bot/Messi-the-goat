import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyQuestion, localDateKey, parseDailyAttempt } from './arcade-daily';
import { betterRecord } from './useArcadeRecord';

test('daily challenge uses the device local date including padded month and day', () => {
  assert.equal(localDateKey(new Date(2026, 0, 2, 23, 59)), '2026-01-02');
  assert.equal(localDateKey(new Date(2026, 11, 31, 0, 0)), '2026-12-31');
});
test('daily selection is deterministic and source-backed', () => {
  assert.equal(dailyQuestion('2026-10-27'), dailyQuestion('2026-10-27'));
  assert.notEqual(dailyQuestion('2026-10-27').id, dailyQuestion('2026-10-28').id);
  assert.ok(dailyQuestion('2026-10-27').sourceUrl.startsWith('https://'));
});
test('daily storage accepts only today, matching question and a valid choice', () => {
  const date = '2026-10-27';
  const valid = { date, questionId: dailyQuestion(date).id, choice: 0 };
  assert.deepEqual(parseDailyAttempt(JSON.stringify(valid), date), valid);
  for (const raw of [null, '', '{}', '[1]', 'not-json', 'null', JSON.stringify({...valid,date:'2026-10-26'}), JSON.stringify({...valid,questionId:'missing'}), JSON.stringify({...valid,choice:1.5}), JSON.stringify({...valid,choice:-1}), JSON.stringify({...valid,choice:99}), JSON.stringify({...valid,choice:'0'})]) assert.equal(parseDailyAttempt(raw,date),null);
});
test('best-record reducer validates candidates and never worsens a record', () => {
  assert.equal(betterRecord(null, 0, 5), 0);
  assert.equal(betterRecord(4, 3, 5), 4);
  assert.equal(betterRecord(3, 5, 5), 5);
  assert.equal(betterRecord(5, 6, 5), 5);
  assert.equal(betterRecord(250, 300, 60000, true), 250);
  assert.equal(betterRecord(250, 200, 60000, true), 200);
  assert.equal(betterRecord(4, 3, 100, true, 4), 4);
  assert.equal(betterRecord(NaN, 5, 5), 5);
  for (const invalid of [-1, 2.5, Infinity, NaN]) assert.equal(betterRecord(null, invalid, 5), null);
});
