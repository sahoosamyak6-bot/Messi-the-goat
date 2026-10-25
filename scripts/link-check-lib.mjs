import { existsSync } from 'node:fs';
import path from 'node:path';

export const APPROVED_HOSTS = new Set(['inside.fifa.com', 'en.news.psg.fr', 'www.nashvillesc.com', 'commons.wikimedia.org', 'creativecommons.org', 'www.fcbarcelona.com', 'www.fifa.com', 'www.uefa.com', 'www.psg.fr', 'en.psg.fr', 'www.intermiamicf.com', 'www.mlssoccer.com', 'www.conmebol.com', 'copaamerica.com', 'www.theguardian.com', 'www.youtube.com']);
export function allowedExternal(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !url.port && APPROVED_HOSTS.has(url.hostname); } catch { return false; }
}
export function attributes(html, name) {
  return [...html.matchAll(new RegExp(`\\b${name}="([^"]*)"`, 'g'))].map(match => match[1].replaceAll('&amp;', '&'));
}
export function checkLocalLinks(html, publicDir) {
  const ids = new Set(attributes(html, 'id'));
  const errors = [];
  for (const href of attributes(html, 'href')) {
    if (href.startsWith('#') && href.length > 1) {
      let id; try { id = decodeURIComponent(href.slice(1)); } catch { errors.push(`Malformed fragment: ${href}`); continue; }
      if (!ids.has(id)) errors.push(`Missing fragment target: ${href}`);
    }
  }
  const assets = [...attributes(html, 'src'), ...attributes(html, 'href'), ...attributes(html, 'srcSet').flatMap(set => set.split(',').map(item => item.trim().split(/\s+/)[0]))];
  for (const asset of assets) {
    if (!asset.startsWith('/') || asset.startsWith('//') || asset === '/') continue;
    const pathname = asset.split(/[?#]/)[0];
    const local = path.resolve(publicDir, '.' + pathname);
    if (!local.startsWith(path.resolve(publicDir) + path.sep) || !existsSync(local)) errors.push(`Missing local asset: ${asset}`);
  }
  return [...new Set(errors)];
}
export async function checkExternal(value, fetcher = fetch) {
  if (!allowedExternal(value)) return { url: value, status: 'skipped', detail: 'Not an approved public HTTPS host' };
  let current = value;
  try {
    for (let redirects = 0; redirects < 5; redirects++) {
      const response = await fetcher(current, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'MessiFanArchive-LinkCheck/1.0' } });
      await response.body?.cancel();
      if ([301,302,303,307,308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) return { url: value, status: 'inconclusive', detail: 'Redirect without Location' };
        current = new URL(location, current).href;
        if (!allowedExternal(current)) return { url: value, status: 'inconclusive', detail: 'Redirect outside approved public hosts' };
        continue;
      }
      return { url: value, status: response.ok ? 'ok' : [404,410].includes(response.status) ? 'broken' : 'inconclusive', detail: `HTTP ${response.status}` };
    }
    return { url: value, status: 'inconclusive', detail: 'Redirect limit' };
  } catch (error) { return { url: value, status: 'inconclusive', detail: error.name }; }
}
