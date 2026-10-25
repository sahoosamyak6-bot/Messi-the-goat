import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNewsHandler, fetchMessiNews, MAX_FEED_BYTES, NEWS_CACHE_CONTROL, NEWS_FEED_URL, parseMessiRss } from '../../lib/messi-news.js';

const NOW = new Date('2026-10-25T12:00:00Z');
const date = 'Wed, 07 Oct 2026 17:02:22 GMT';
const link = 'https://www.theguardian.com/football/2026/oct/07/messi-example';
const story = (title = 'Messi match report', href = link, published = date, author = 'Sports desk') => `<item><title>${title}</title><link>${href}</link><pubDate>${published}</pubDate><dc:creator>${author}</dc:creator><description><![CDATA[<img src="https://example.test/tracker"><p>Never display this body</p>]]></description></item>`;
const rss = (items = story()) => `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0"><channel><title>Messi</title><pubDate>Sun, 25 Oct 2026 12:00:00 GMT</pubDate>${items}</channel></rss>`;
const upstream = (body = rss(), status = 200, type = 'text/xml; charset=utf-8') => new Response(body, { status, headers: { 'Content-Type': type } });
function responseSpy() {
  return {
    headers: {} as Record<string, string>, code: 0, body: undefined as unknown, ended: false,
    setHeader(name: string, value: string) { this.headers[name] = value; },
    status(code: number) { this.code = code; return this; },
    json(body: unknown) { this.body = body; return this; },
    end() { this.ended = true; return this; },
  };
}

test('RSS returns only headlines, original bylines, safe links and item publication dates', () => {
  const result = parseMessiRss(rss(story('Messi &amp; Miami&#8217;s win', link, date, 'A &amp; B')), NOW.getTime());
  assert.deepEqual(result, [{ title: 'Messi & Miami’s win', href: link, publishedAt: '2026-10-07T17:02:22.000Z', author: 'A & B', source: 'The Guardian' }]);
  assert.equal(JSON.stringify(result).includes('Never display'), false);
});

test('CDATA and numeric entities are supported without accepting markup as titles', () => {
  assert.equal(parseMessiRss(rss(story('<![CDATA[Messi wins again]]>')), NOW.getTime())[0].title, 'Messi wins again');
  for (const title of ['<![CDATA[<script>alert(1)</script>]]>', '&lt;img src=x&gt;', '<b>Messi</b>']) {
    assert.equal(parseMessiRss(rss(story(title)), NOW.getTime()).length, 0);
  }
});

test('DTD, custom or invalid entities, bad attributes and malformed XML fail closed', () => {
  for (const xml of [
    '<!DOCTYPE rss [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' + rss(),
    rss(story('Messi &unknown;')), rss(story('Messi &#0;')), rss(story('Messi &#x110000;')),
    rss().replace('</channel>', '</wrong>'), rss() + '<rss/>', rss().replace('version="2.0"', 'version=no'),
    rss().replace('version="2.0"', 'version="2.0" version="2.0"'), '<html>Not a feed</html>',
  ]) assert.throws(() => parseMessiRss(xml, NOW.getTime()));
});

test('unsafe destinations, invalid/future dates and duplicate links are discarded', () => {
  const items = story() + story('Duplicate', link + '?utm_source=test') +
    ['javascript:alert(1)', 'https://www.theguardian.com.evil.test/football/2026/oct/07/messi',
      'https://user@www.theguardian.com/football/2026/oct/07/messi', 'http://www.theguardian.com/football/2026/oct/07/messi',
      'https://www.theguardian.com:444/football/2026/oct/07/messi', 'https://www.theguardian.com/football/lionel-messi']
      .map(href => story('Unsafe', href)).join('') + story('Invalid', link + '-bad', 'not a date') +
    story('Future', link + '-future', '2027-01-01T00:00:00Z');
  assert.equal(parseMessiRss(rss(items), NOW.getTime()).length, 1);
});

test('headlines are date-sorted, limited to six, and kept below 100 combined words', () => {
  const many = Array.from({ length: 12 }, (_, i) => story('Messi report ' + i, link + '-' + i, `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`)).join('');
  const result = parseMessiRss(rss(many), NOW.getTime());
  assert.equal(result.length, 6); assert.equal(result[0].title, 'Messi report 11');
  const long = Array.from({ length: 10 }, (_, i) => story(Array(20).fill('word').join(' '), link + '-' + i)).join('');
  assert.equal(parseMessiRss(rss(long), NOW.getTime()).length, 4);
});

test('fetch uses a fixed URL, rejects redirects, and records real fetch time separately', async () => {
  const result = await fetchMessiNews({ now: () => NOW, fetchImpl: async (url, options) => {
    assert.equal(url, NEWS_FEED_URL); assert.equal(options?.redirect, 'error');
    assert.equal(options?.method, 'GET'); assert.ok(options?.signal); return upstream();
  } });
  assert.equal(result.status, 'ok'); assert.equal(result.fetchedAt, NOW.toISOString());
  assert.equal(result.items[0].publishedAt, '2026-10-07T17:02:22.000Z');
});

test('fetch rejects HTML, empty 202 responses, malformed feeds and excessive streamed bytes', async () => {
  for (const make of [() => upstream('<html>blocked</html>', 200, 'text/html'), () => upstream('', 202),
    () => upstream('<rss>'), () => upstream(' '.repeat(MAX_FEED_BYTES + 1))]) {
    await assert.rejects(fetchMessiNews({ fetchImpl: async () => make(), now: () => NOW }));
  }
});

test('request timeout aborts upstream and does not hang the endpoint', async () => {
  let signal: AbortSignal | undefined;
  await assert.rejects(fetchMessiNews({ timeoutMs: 10, fetchImpl: async (_url, options) => {
    signal = options?.signal as AbortSignal; return new Promise<Response>(() => {});
  } }), /timed out/);
  assert.equal(signal?.aborted, true);
});

test('API success and empty success cache correctly without adding fake stories', async () => {
  for (const body of [rss(), rss('')]) {
    const response = responseSpy();
    await createNewsHandler({ now: () => NOW, fetchImpl: async () => upstream(body) })({ method: 'GET', query: { url: 'http://localhost' } }, response);
    assert.equal(response.code, 200); assert.equal(response.headers['Cache-Control'], NEWS_CACHE_CONTROL);
    assert.equal((response.body as { status: string }).status, 'ok');
  }
});

test('upstream outage is 503/no-store with no fake snapshot or successful timestamp', async () => {
  const response = responseSpy();
  await createNewsHandler({ fetchImpl: async () => { throw new Error('upstream offline'); } })({ method: 'GET' }, response);
  assert.equal(response.code, 503); assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.deepEqual(response.body, { items: [], fetchedAt: null, source: 'The Guardian', status: 'unavailable' });
});

test('unsupported methods never call upstream and HEAD has no body', async () => {
  const rejected = responseSpy();
  await createNewsHandler({ fetchImpl: async () => { throw new Error('Must not run'); } })({ method: 'POST' }, rejected);
  assert.equal(rejected.code, 405); assert.equal(rejected.headers.Allow, 'GET, HEAD');
  const head = responseSpy();
  await createNewsHandler({ now: () => NOW, fetchImpl: async () => upstream() })({ method: 'HEAD' }, head);
  assert.equal(head.code, 200); assert.equal(head.ended, true); assert.equal(head.body, undefined);
});

test('same-instance requests coalesce and cache without advancing the successful fetch timestamp', async () => {
  let calls = 0;
  let time = NOW;
  const handler = createNewsHandler({ now: () => time, fetchImpl: async () => { calls++; return upstream(); } });
  const first = responseSpy(); const parallel = responseSpy();
  await Promise.all([handler({ method: 'GET' }, first), handler({ method: 'GET' }, parallel)]);
  time = new Date(NOW.getTime() + 10 * 60 * 1000);
  const cached = responseSpy(); await handler({ method: 'GET' }, cached);
  assert.equal(calls, 1);
  assert.equal((cached.body as { fetchedAt: string }).fetchedAt, NOW.toISOString());
  time = new Date(NOW.getTime() + 31 * 60 * 1000);
  await handler({ method: 'GET' }, responseSpy());
  assert.equal(calls, 2);
});
