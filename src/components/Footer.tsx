import { isPlainPrimaryClick } from '../utils/navigation';
import { ArrowUp, Share2 } from 'lucide-react';
import { photoCredits } from '../data/photo-assets';

export function Footer({ onNavigate, onOpenShare }: { onNavigate: (id: string) => void; onOpenShare: () => void }) {
  return <footer className="site-footer">
    <div className="footer-top">
      <div><a className="brand" href="#hero" onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); onNavigate('hero'); }}><span className="brand-number">10<span /></span><span className="brand-name">MESSI<span>THE LEGACY ARCHIVE</span></span></a><p className="footer-description">A fan-made tribute to the boy from Rosario and the game he changed. Argentina in the heart. Barcelona in the story.</p></div>
      <nav className="footer-index" aria-label="Archive index">{[['Latest coverage', 'news'], ['Biography', 'biography'], ['Career statistics', 'statistics'], ['Crown achievements', 'achievement-timeline'], ['Career timeline', 'career-timeline'], ['Iconic moments', 'gallery'], ['Interactive lab', 'lab'], ['Messi arcade', 'games'], ['Trophy cabinet', 'trophies'], ['Quiz & local polls', 'trivia-quotes']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); onNavigate(id); }}>{label}</a>)}</nav>
      <div><button className="back-top" onClick={onOpenShare}>Share section link <Share2 size={15} /></button><button className="back-top" onClick={() => onNavigate('hero')}>Back to the top <ArrowUp size={15} /></button></div>
    </div>
    <section aria-labelledby="fan-disclaimer" className="photo-credits">
      <h2 id="fan-disclaimer" className="font-semibold mb-2">Independent fan site</h2>
      <p>Made by fans for fans. This site is not affiliated with, endorsed by, or operated by Lionel Messi, his representatives, FC Barcelona, Paris Saint-Germain, Inter Miami CF, the Argentina national team, or any competition organiser. Names and marks identify their respective owners; photo credits do not imply endorsement.</p>
      <p className="mt-2">Career content is a historical archive, not a live statistics service. News links identify their original publishers. <a href="/photos/CREDITS.md" className="underline">Read the complete photo attribution record</a>.</p>
    </section>
    <details className="photo-credits" id="photo-credits"><summary>Photography credits & licenses</summary><p>Real archive photographs, not generated imagery. Photos are resized into responsive WebP versions; the layout may crop them. A contextual archive photo does not necessarily depict the moment described beside it. Each photograph retains its linked Creative Commons license.</p><ul>{photoCredits.map(photo => <li key={photo.src}><a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.alt}</a><br />{photo.credit} · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a><br /><small>{photo.modifications}</small></li>)}</ul></details>
    <div className="footer-bottom"><span>INDEPENDENT FAN ARCHIVE · NOT AN OFFICIAL MESSI WEBSITE</span><span>Historical statistics. Separately refreshed coverage. Local polls.</span></div>
  </footer>;
}
