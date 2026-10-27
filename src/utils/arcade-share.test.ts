import test from 'node:test';
import assert from 'node:assert/strict';
import { ARCADE_PUBLIC_URL, arcadeCopyText, buildArcadeShare, shareArcadeResult } from './arcade-share';

test('result text always points at canonical games without claiming leaderboard verification', () => {
  assert.equal(buildArcadeShare('  4 of 5 goals  ').url, ARCADE_PUBLIC_URL);
  assert.match(arcadeCopyText('4 of 5 goals'), /^4 of 5 goals\n/);
  assert.match(arcadeCopyText('4 of 5 goals'), /not a verified leaderboard/);
  assert.ok(arcadeCopyText('4 of 5 goals').endsWith('https://messi-the-goat.vercel.app/#games'));
});
test('native share passes exact result and reports completed only after resolution', async () => {
  let resolve!: () => void;
  const task = shareArcadeResult('8 / 8', data => { assert.equal(data.text, buildArcadeShare('8 / 8').text); return new Promise(done => { resolve = done; }); }, new AbortController().signal);
  resolve(); assert.equal(await task, 'completed');
});
test('native cancellation is not success or a clipboard fallback', async () => {
  const result = await shareArcadeResult('8 / 8', async () => { throw { name: 'AbortError' }; }, new AbortController().signal);
  assert.equal(result, 'cancelled');
});
test('unsupported and rejected sharing are reported unavailable', async () => {
  const signal = new AbortController().signal;
  assert.equal(await shareArcadeResult('x', undefined, signal), 'unavailable');
  assert.equal(await shareArcadeResult('x', async () => { throw new Error('denied'); }, signal), 'unavailable');
});
test('aborted requests never open a share sheet and late completions stay stale', async () => {
  const already = new AbortController(); already.abort();
  assert.equal(await shareArcadeResult('x', async () => assert.fail('must not share'), already.signal), 'stale');
  const current = new AbortController(); let resolve!: () => void;
  const task = shareArcadeResult('x', () => new Promise(done => { resolve = done; }), current.signal);
  current.abort(); resolve(); assert.equal(await task, 'stale');
});
