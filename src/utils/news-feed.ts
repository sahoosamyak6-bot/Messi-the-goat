export interface NewsItem { title: string; author: string; source: string; publishedAt: string; href: string; }
export interface NewsFeed { items: NewsItem[]; fetchedAt: string; source: string; }

export function parseNewsResponse(value: unknown): NewsFeed {
  if (!value || typeof value !== 'object') throw new Error('Invalid news response');
  const feed = value as Record<string, unknown>;
  if (feed.status !== 'ok' || !Array.isArray(feed.items) || typeof feed.fetchedAt !== 'string' || !Number.isFinite(Date.parse(feed.fetchedAt))) throw new Error('Coverage is unavailable');
  const seen = new Set<string>();
  let words = 0;
  const items: NewsItem[] = [];
  for (const entry of feed.items) {
    if (!entry || typeof entry !== 'object' || items.length >= 6) continue;
    const item = entry as Record<string, unknown>;
    if (typeof item.title !== 'string' || !item.title.trim() || item.title.length > 300 || /[<>]/.test(item.title) || typeof item.href !== 'string' || typeof item.publishedAt !== 'string' || !Number.isFinite(Date.parse(item.publishedAt))) continue;
    let link: URL;
    try { link = new URL(item.href); } catch { continue; }
    if (link.protocol !== 'https:' || link.hostname !== 'www.theguardian.com' || link.username || link.password || link.port || seen.has(link.href)) continue;
    const count = item.title.trim().split(/\s+/).length;
    if (words + count >= 100) continue;
    words += count; seen.add(link.href);
    items.push({ title: item.title.trim(), href: link.href, publishedAt: new Date(item.publishedAt).toISOString(), source: 'The Guardian', author: typeof item.author === 'string' ? item.author.slice(0, 240) : '' });
  }
  return { items, fetchedAt: new Date(feed.fetchedAt).toISOString(), source: 'The Guardian' };
}

export function isNewsStale(fetchedAt: string, now = Date.now()): boolean {
  const fetched = Date.parse(fetchedAt);
  return !Number.isFinite(fetched) || now - fetched > 2 * 60 * 60 * 1000 || fetched > now + 5 * 60 * 1000;
}
