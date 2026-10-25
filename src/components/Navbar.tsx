import { isPlainPrimaryClick } from '../utils/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Volume2, VolumeX, X } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NavbarProps { activeSection: string; onNavigate: (id: string) => void; onOpenSearch: () => void; }
const navigation = [
  ['Biography', 'biography'], ['Timeline', 'career-timeline'], ['Statistics', 'statistics'],
  ['In pictures', 'gallery'], ['The lab', 'lab'], ['Honours', 'trophies'],
] as const;

export function Navbar({ activeSection, onNavigate, onOpenSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMuted, setMuted] = useState(soundFx.getIsMuted());
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => document.documentElement.style.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`);
    const resize = new ResizeObserver(update); resize.observe(header); update();
    return () => resize.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    navRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); setMenuOpen(false); toggleRef.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false); };
    const desktop = window.matchMedia('(min-width: 1101px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', escape); document.addEventListener('pointerdown', outside); desktop.addEventListener('change', closeOnDesktop);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', closeOnDesktop); };
  }, [menuOpen]);
  const navigate = (id: string) => { setMenuOpen(false); onNavigate(id); soundFx.playClickTone(); };
  return <>
    <div className="topline"><span>ROSARIO ROOTS. WORLDWIDE MAGIC.</span><span><i /> INDEPENDENT FAN ARCHIVE</span></div>
    <header ref={headerRef} className="site-header" onBlur={event => { if (menuOpen && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); }}>
      <a className="brand" href="#hero" aria-label="Messi Legacy home" onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); navigate('hero'); }}><span className="brand-number">10<span /></span><span className="brand-name">MESSI<span>THE LEGACY ARCHIVE</span></span></a>
      <nav id="main-navigation" ref={navRef} className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {navigation.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); navigate(id); }}>{label}</a>)}
        <a className="mobile-nav-extra" href="#achievement-timeline" onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); navigate('achievement-timeline'); }}>Crown achievements</a>
        <a className="mobile-nav-extra" href="#trivia-quotes" onClick={event => { if (!isPlainPrimaryClick(event)) return; event.preventDefault(); navigate('trivia-quotes'); }}>Fan challenge & polls</a>
      </nav>
      <div className="header-tools">
        <button className="icon-button search-toggle" aria-label="Search the archive" title="Search (Ctrl or Command K)" onClick={() => { setMenuOpen(false); onOpenSearch(); }}><Search size={19} /></button>
        <button className="icon-button sound-toggle" aria-label={isMuted ? 'Enable sound effects' : 'Mute sound effects'} aria-pressed={!isMuted} title={isMuted ? 'Sound off' : 'Sound on'} onClick={() => { const muted = soundFx.toggleMute(); setMuted(muted); if (!muted) soundFx.playClickTone(); }}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        <button ref={toggleRef} className="menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </header>
  </>;
}
