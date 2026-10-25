import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Newspaper, RefreshCw } from 'lucide-react';
import { isNewsStale, parseNewsResponse, type NewsFeed } from '../utils/news-feed';
import './latest-coverage.css';

const REFRESH_INTERVAL = 30 * 60 * 1000;
const dateLabel = (value: string) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const checkedLabel = (value: string) => new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

function CoverageFeed() {
  const [feed, setFeed] = useState<NewsFeed | null>(null);
  const [busy, setBusy] = useState(true);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(Date.now);
  const inFlight = useRef<AbortController | null>(null);
  const lastAttempt = useRef(0);
  const mounted = useRef(false);
  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    lastAttempt.current = Date.now();
    setBusy(true);
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch('/api/messi-news', { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('News source unavailable');
      const next = parseNewsResponse(await response.json());
      if (mounted.current && inFlight.current === controller) { setFeed(next); setFailed(false); setNow(Date.now()); }
    } catch {
      if (mounted.current && inFlight.current === controller) { setFailed(true); setNow(Date.now()); }
    } finally {
      clearTimeout(timeout);
      if (inFlight.current === controller) { inFlight.current = null; if (mounted.current) setBusy(false); }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    void refresh();
    const check = () => {
      if (document.visibilityState !== 'visible') return;
      setNow(Date.now());
      if (Date.now() - lastAttempt.current >= REFRESH_INTERVAL) void refresh();
    };
    const timer = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => { mounted.current = false; inFlight.current?.abort(); inFlight.current = null; clearInterval(timer); document.removeEventListener('visibilitychange', check); };
  }, [refresh]);
  const stale = Boolean(feed && isNewsStale(feed.fetchedAt, now));
  return <>
    <div className="coverage-toolbar">
      <p role="status" aria-live="polite">{busy ? 'Checking the latest coverage…' : feed ? `Feed checked ${checkedLabel(feed.fetchedAt)}` : 'The news feed is temporarily unavailable.'}</p>
      <button type="button" onClick={() => void refresh()} disabled={busy}><RefreshCw size={14} aria-hidden="true" />{busy ? 'Checking' : 'Refresh coverage'}</button>
    </div>
    {(failed || stale) && feed && <p className="coverage-warning" role="status">{failed ? 'The latest refresh could not reach the source. Previously loaded coverage is still shown.' : 'This feed check is more than two hours old. Refresh to check for newer coverage.'}</p>}
    {feed && feed.items.length > 0 ? <div className="coverage-grid">{feed.items.map((item, index) => <article key={item.href} className="coverage-card">
      <div className="coverage-card-top"><span>{item.source}</span><time dateTime={item.publishedAt}>{dateLabel(item.publishedAt)}</time></div>
      <span className="coverage-number" aria-hidden="true">0{index + 1}</span>
      <h3>{item.title}</h3>
      <p className="coverage-byline">{item.author || 'The Guardian'}</p>
      <a href={item.href} target="_blank" rel="noopener noreferrer">Read the original report <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">: {item.title} (opens in a new tab)</span></a>
    </article>)}</div> : <div className="coverage-empty"><Newspaper size={28} aria-hidden="true" /><p>{busy ? 'Fresh headlines are on their way.' : feed ? 'No recent Messi headlines are available from this source right now.' : 'The archive, photographs and lab still work. Try refreshing the coverage in a little while.'}</p></div>}
    <p className="coverage-credit">Courtesy of Guardian News &amp; Media Ltd. Headlines and bylines only, with links to the original journalism. Coverage may not be published every day. This is not a live match feed. Checks refresh about every 30 minutes while this page is visible.</p>
  </>;
}

class CoverageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="coverage-empty" role="status">Coverage could not be displayed. The rest of the archive is still available.</p> : this.props.children; }
}

export function LatestCoverage() {
  return <section id="news" className="latest-coverage" aria-labelledby="coverage-title">
    <div className="coverage-heading"><div><span className="coverage-eyebrow">BEYOND THE ARCHIVE</span><h2 id="coverage-title">Latest Messi <em>coverage.</em></h2></div><p>The story keeps moving. Recent headlines from The Guardian, with the source and publication date always in view.</p></div>
    <CoverageBoundary><CoverageFeed /></CoverageBoundary>
  </section>;
}
