import { isPlainPrimaryClick } from '../utils/navigation';
import './mobile-quick-nav.css';

interface MobileQuickNavProps {
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
}

/** In-flow shortcuts: never cover the archive, dialogs or game controls. */
export function MobileQuickNav({ onNavigate, onOpenSearch }: MobileQuickNavProps) {
  return <nav className="mobile-quick-nav" aria-label="Quick archive shortcuts">
    <span className="mobile-quick-label">Jump into the archive</span>
    <div className="mobile-quick-links">
      {[['Photos', 'gallery'], ['Timeline', 'career-timeline'], ['Play games', 'games']].map(([label, id]) =>
        <a key={id} href={`#${id}`} onClick={event => {
          if (!isPlainPrimaryClick(event)) return;
          event.preventDefault();
          onNavigate(id);
        }}>{label}</a>)}
      <button type="button" onClick={onOpenSearch}>Search</button>
    </div>
  </nav>;
}
