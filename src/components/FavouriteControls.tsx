import './favourites.css';

export function FavouriteButton({ saved, onClick, label }: { saved: boolean; onClick: () => void; label: string }) {
  return <button type="button" className="favourite-button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${label}`} onClick={onClick}><span aria-hidden="true">{saved ? '★' : '☆'}</span> {saved ? 'Saved' : 'Save favourite'}</button>;
}
export function FavouriteFilter({ onlySaved, onChange, count, unavailable, label }: { onlySaved: boolean; onChange: (value: boolean) => void; count: number; unavailable: boolean; label: string }) {
  return <div className="favourite-toolbar"><div role="group" aria-label={`${label} favourites filter`} className="favourite-filter"><button type="button" aria-pressed={!onlySaved} onClick={() => onChange(false)}>All {label}</button><button type="button" aria-pressed={onlySaved} onClick={() => onChange(true)}>Saved {label} ({count})</button></div><p role="status">{unavailable ? 'Storage unavailable. Favourites work for this visit only.' : 'Favourites are saved only in this browser on this device. No account or public list.'}</p></div>;
}
