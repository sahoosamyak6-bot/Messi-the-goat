import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { allowedExternal, checkLocalLinks, checkExternal } from './link-check-lib.mjs';
test('local links detect missing fragments and files including srcsets', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'links-'));
  try { writeFileSync(path.join(dir, 'ok.webp'), 'image');
    assert.deepEqual(checkLocalLinks('<div id="quiz"></div><a href="#quiz">Quiz</a><img src="/ok.webp">', dir), []);
    assert.equal(checkLocalLinks('<a href="#missing">x</a><img srcSet="/ok.webp 400w, /absent.webp 800w">', dir).length, 2);
    assert.equal(checkLocalLinks('<a href="#%zz">x</a>', dir).length, 1);
  } finally { rmSync(dir, { recursive: true }); }
});
test('external checks reject credentials, non-HTTPS, private and arbitrary hosts', () => {
  for (const url of ['http://www.fifa.com/', 'https://127.0.0.1/', 'https://169.254.169.254/', 'https://www.fifa.com.evil.test/', 'https://user:pass@www.fifa.com/', 'https://www.fifa.com:8000/']) assert.equal(allowedExternal(url), false);
  assert.equal(allowedExternal('https://www.fifa.com/'), true);
});
test('redirects are validated before another request', async () => {
  let count = 0;
  const result = await checkExternal('https://www.fifa.com/', async () => { count++; return new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/' } }); });
  assert.equal(count, 1); assert.equal(result.status, 'inconclusive');
});
test('dead links differ from throttling or access blocks', async () => {
  for (const [code, status] of [[200, 'ok'], [404, 'broken'], [410, 'broken'], [403, 'inconclusive'], [429, 'inconclusive'], [503, 'inconclusive']]) assert.equal((await checkExternal('https://www.fifa.com/', async () => new Response(null, { status: code }))).status, status);
});
