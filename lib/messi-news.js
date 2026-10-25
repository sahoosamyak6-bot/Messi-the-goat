/** A deliberately small, fixed-source RSS reader. No article bodies leave this module. */
export const NEWS_SOURCE = 'The Guardian';
export const NEWS_FEED_URL = 'https://www.theguardian.com/football/lionel-messi/rss';
export const MAX_FEED_BYTES = 512 * 1024;
export const NEWS_CACHE_CONTROL = 'public, max-age=60, s-maxage=1800, stale-while-revalidate=3600, stale-if-error=86400';
const XML_NAME = '[A-Za-z_][A-Za-z0-9_.:-]*';
const FIELD_LIMIT = 4096;

function validXmlCharacter(code) {
  return code === 9 || code === 10 || code === 13 ||
    (code >= 0x20 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0xfffd) ||
    (code >= 0x10000 && code <= 0x10ffff);
}

function decodeXmlText(value) {
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;|#x[0-9a-fA-F]+;)/.test(value)) {
    throw new Error('Unsupported XML entity');
  }
  return value.replace(/&(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);/g, (_, entity) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    if (entity in named) return named[entity];
    const code = entity.startsWith('#x') ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    if (!validXmlCharacter(code)) throw new Error('Invalid XML character');
    return String.fromCodePoint(code);
  });
}

function validateAttributes(value) {
  const names = new Set();
  let rest = value;
  while (rest.trim()) {
    const match = rest.match(new RegExp(`^\\s+(${XML_NAME})\\s*=\\s*(?:"([^"<]*)"|'([^'<]*)')`));
    if (!match || names.has(match[1])) throw new Error('Invalid XML attributes');
    names.add(match[1]);
    decodeXmlText(match[2] ?? match[3]);
    rest = rest.slice(match[0].length);
  }
}

/** Strict enough for this RSS dialect: DTDs, entities, malformed structure and nested text fields fail closed. */
function parseXml(xml) {
  if (typeof xml !== 'string' || new TextEncoder().encode(xml).byteLength > MAX_FEED_BYTES ||
      /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Unsupported RSS document');
  for (const character of xml) {
    if (!validXmlCharacter(character.codePointAt(0))) throw new Error('Invalid XML character');
  }
  xml = xml.replace(/^\uFEFF/, '');
  const document = { name: '#document', children: [], text: '' };
  const stack = [document];
  let position = 0;
  let elements = 0;
  while (position < xml.length) {
    const current = stack[stack.length - 1];
    if (xml[position] !== '<') {
      const end = xml.indexOf('<', position);
      const text = xml.slice(position, end === -1 ? xml.length : end);
      if (text.includes(']]>')) throw new Error('Invalid XML text');
      current.text += decodeXmlText(text);
      position = end === -1 ? xml.length : end;
      continue;
    }
    if (xml.startsWith('<!--', position)) {
      const end = xml.indexOf('-->', position + 4);
      if (end === -1 || xml.slice(position + 4, end).includes('--')) throw new Error('Invalid XML comment');
      position = end + 3;
      continue;
    }
    if (xml.startsWith('<![CDATA[', position)) {
      const end = xml.indexOf(']]>', position + 9);
      if (end === -1 || stack.length === 1) throw new Error('Invalid CDATA');
      current.text += xml.slice(position + 9, end);
      position = end + 3;
      continue;
    }
    if (xml.startsWith('<?', position)) {
      const end = xml.indexOf('?>', position + 2);
      if (end === -1 || position !== 0 || !xml.startsWith('<?xml ', position)) throw new Error('Unsupported XML instruction');
      validateAttributes(xml.slice(position + 5, end));
      position = end + 2;
      continue;
    }
    // Quote-aware scanning avoids interpreting a '>' within an attribute as the end of a tag.
    let end = position + 1;
    let quote = '';
    for (; end < xml.length; end++) {
      const char = xml[end];
      if (quote) { if (char === quote) quote = ''; }
      else if (char === '"' || char === "'") quote = char;
      else if (char === '>') break;
    }
    if (end >= xml.length) throw new Error('Unterminated XML tag');
    const tag = xml.slice(position + 1, end);
    if (tag.startsWith('/')) {
      const close = tag.match(new RegExp(`^/(${XML_NAME})\\s*$`));
      if (!close || stack.length === 1 || current.name !== close[1]) throw new Error('Mismatched XML tag');
      stack.pop();
    } else {
      const selfClosing = tag.endsWith('/');
      const open = (selfClosing ? tag.slice(0, -1) : tag).match(new RegExp(`^(${XML_NAME})([\\s\\S]*)$`));
      if (!open || ++elements > 10000 || stack.length > 64) throw new Error('Unsupported XML structure');
      validateAttributes(open[2]);
      const node = { name: open[1], children: [], text: '' };
      current.children.push(node);
      if (!selfClosing) stack.push(node);
    }
    position = end + 1;
  }
  if (stack.length !== 1 || document.children.length !== 1 || document.text.trim()) throw new Error('Incomplete XML document');
  return document.children[0];
}

function field(node, name) {
  const fields = node.children.filter(child => child.name === name);
  if (fields.length !== 1 || fields[0].children.length || fields[0].text.length > FIELD_LIMIT) return '';
  return fields[0].text.replace(/\s+/g, ' ').trim();
}

function plainText(value, maximum) {
  return value && value.length <= maximum && !/[<>\u0000-\u001f\u007f]/.test(value) ? value : '';
}

function articleLink(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'www.theguardian.com' || url.username || url.password || url.port ||
        !/\/\d{4}\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{2}\/[^/]+/.test(url.pathname)) return '';
    // Feed links are canonical; discard tracking and fragment differences for deduplication.
    url.search = '';
    url.hash = '';
    return url.href;
  } catch { return ''; }
}

export function parseMessiRss(xml, now = Date.now()) {
  const root = parseXml(xml);
  const channels = root.children.filter(node => node.name === 'channel');
  if (root.name !== 'rss' || channels.length !== 1) throw new Error('Expected RSS channel');
  const candidates = [];
  for (const item of channels[0].children.filter(node => node.name === 'item')) {
    const title = plainText(field(item, 'title'), 300);
    const href = articleLink(field(item, 'link'));
    const authorValue = field(item, 'dc:creator');
    const author = plainText(authorValue, 240);
    const published = Date.parse(field(item, 'pubDate') || field(item, 'dc:date'));
    if (!title || !href || (authorValue && !author) || !Number.isFinite(published) || published < 0 || published > now + 5 * 60 * 1000) continue;
    candidates.push({ title, href, author, source: NEWS_SOURCE, publishedAt: new Date(published).toISOString() });
  }
  candidates.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const items = [];
  const seen = new Set();
  let words = 0;
  for (const item of candidates) {
    const count = item.title.split(/\s+/).length;
    if (seen.has(item.href) || words + count >= 100) continue;
    seen.add(item.href);
    words += count;
    items.push(item);
    if (items.length === 6) break;
  }
  return items;
}

async function readBoundedXml(response) {
  const length = Number(response.headers.get('content-length'));
  if (length > MAX_FEED_BYTES || !response.body) throw new Error('Invalid feed size');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) { await reader.cancel(); throw new Error('Feed too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export async function fetchMessiNews({ fetchImpl = globalThis.fetch, now = () => new Date(), timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error('Feed request timed out')); }, timeoutMs);
  });
  const request = (async () => {
    const response = await fetchImpl(NEWS_FEED_URL, {
      method: 'GET', redirect: 'error', signal: controller.signal,
      headers: { Accept: 'application/rss+xml, application/xml, text/xml;q=0.9', 'User-Agent': 'MessiFanSite/1.0' },
    });
    if (response.status !== 200 || !/^(application\/(?:rss\+xml|xml)|text\/xml)(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) {
      throw new Error('Feed returned an unexpected response');
    }
    const xml = await readBoundedXml(response);
    const fetched = now();
    const items = parseMessiRss(xml, fetched.getTime());
    return { items, fetchedAt: fetched.toISOString(), source: NEWS_SOURCE, status: 'ok' };
  })();
  try { return await Promise.race([request, timeout]); }
  finally { clearTimeout(timer); }
}

export function createNewsHandler(dependencies = {}) {
  // Best-effort instance cache and request coalescing supplement the CDN. They are
  // not persistent storage and are intentionally never presented as a snapshot.
  let lastSuccess = null;
  let inFlight = null;
  async function getFeed() {
    const time = (dependencies.now?.() ?? new Date()).getTime();
    const fetched = lastSuccess ? Date.parse(lastSuccess.fetchedAt) : 0;
    if (lastSuccess && time >= fetched && time - fetched < 30 * 60 * 1000) return lastSuccess;
    if (!inFlight) {
      inFlight = fetchMessiNews(dependencies).then(result => {
        lastSuccess = result;
        return result;
      }).finally(() => { inFlight = null; });
    }
    return inFlight;
  }
  return async function messiNews(request, response) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD');
      response.setHeader('Cache-Control', 'no-store');
      return response.status(405).json({ error: 'Method not allowed' });
    }
    try {
      const result = await getFeed();
      response.setHeader('Cache-Control', NEWS_CACHE_CONTROL);
      if (request.method === 'HEAD') return response.status(200).end();
      return response.status(200).json(result);
    } catch {
      response.setHeader('Cache-Control', 'no-store');
      if (request.method === 'HEAD') return response.status(503).end();
      return response.status(503).json({ items: [], fetchedAt: null, source: NEWS_SOURCE, status: 'unavailable' });
    }
  };
}
