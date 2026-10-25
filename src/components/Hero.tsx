import { useState } from 'react';
import { ArrowDown, ArrowUpRight, CirclePlay, Search, Trophy } from 'lucide-react';
import { photoAssets } from '../data/photo-assets';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenHighlightModal?: () => void;
  onOpenSearch?: () => void;
}

export function Hero({ onNavigate, onOpenSearch }: HeroProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = photoAssets.hero;
  return <>
    <section className="hero section-anchor" id="hero" tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow"><span className="argentina-flag" /> LIONEL ANDRÉS MESSI</div>
        <h1 id="hero-title">Made of<br /><em>magic.</em><span className="hero-star" aria-hidden="true">✳</span></h1>
        <p className="hero-lead">A boy from Rosario. A left foot like no other.<br className="desktop-break" /> A story that belongs to the beautiful game.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => onNavigate('gallery')}>Relive the moments <ArrowUpRight size={18} /></button>
          <button className="button button-plain" onClick={() => onNavigate('lab')}><CirclePlay size={21} /> Enter the lab</button>
        </div>
        <div className="hero-note"><span className="little-stars" aria-label="Three stars">★ ★ ★</span><p>For the blue and white.<br /><strong>For the love of football.</strong></p></div>
        {onOpenSearch && <button className="hero-search" onClick={onOpenSearch}><Search size={14} /> Search the entire archive <kbd>⌘ / Ctrl K</kbd></button>}
      </div>
      <figure className="hero-visual">
        <div className="hero-photo-frame">
          {photoFailed ? <div className="hero-photo photo-unavailable"><span>Argentina. Always.</span><small>The archive photograph is unavailable.</small></div> : <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} fetchPriority="high" decoding="async" className="hero-photo" style={{ objectPosition: photo.objectPosition }} onError={() => setPhotoFailed(true)} />}
          <div className="hero-photo-shade" /><span className="hero-photo-label">THE NUMBER <strong>10.</strong></span><span className="hero-photo-footer">ARGENTINA. ALWAYS.</span>
        </div>
        <div className="hero-stamp"><Trophy size={20} /><span>WORLD<br /><strong>CHAMPION</strong></span><small>QATAR 2022</small></div>
        <figcaption className="hero-side-label">WORLD CUP 2022 · PHOTO CREDITS BELOW</figcaption><span className="hero-doodle" aria-hidden="true">✦</span>
      </figure>
      <button className="scroll-cue" onClick={() => onNavigate('biography')}>SCROLL INTO THE STORY <ArrowDown size={15} /></button>
    </section>
    <div className="stat-strip" aria-label="Selected historical honours">
      {[
        ['8', 'Ballon d’Or awards', 'THROUGH 2023'],
        ['1', 'World Cup', 'QATAR 2022'],
        ['2', 'Copa América titles', '2021 & 2024'],
        ['4', 'Champions League titles', 'WITH BARCELONA'],
      ].map(([value, label, detail]) => <div className="stat-item" key={label}><strong>{value}</strong><span>{label}<small>{detail}</small></span></div>)}
    </div>
  </>;
}
