import { useEffect, useRef, useState } from 'react';
import { parseFavourites, toggleFavourite } from './favourites';

export function useFavourites(key: string, allowedIds: readonly string[]) {
  const [saved, setSaved] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const latest = useRef<string[]>([]);
  useEffect(() => {
    try {
      const initial = parseFavourites(localStorage.getItem(key), allowedIds);
      latest.current = initial;
      setSaved(initial);
    } catch { setUnavailable(true); }
    const synchronize = (event: StorageEvent) => {
      if (event.key !== key && event.key !== null) return;
      const updated = parseFavourites(event.newValue, allowedIds);
      latest.current = updated;
      setSaved(updated);
    };
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, [key, allowedIds]);
  const toggle = (id: string) => {
    const next = toggleFavourite(latest.current, id, allowedIds);
    latest.current = next;
    setSaved(next);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { setUnavailable(true); }
  };
  return { saved, toggle, unavailable };
}
