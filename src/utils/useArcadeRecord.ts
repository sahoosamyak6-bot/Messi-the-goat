import { useCallback, useEffect, useRef, useState } from 'react';
import { parseRecord } from './arcade';

export function betterRecord(current: number | null, candidate: number, maximum: number, lowerIsBetter = false, minimum = lowerIsBetter ? 1 : 0): number | null {
  const validCurrent = current === null ? null : parseRecord(String(current), maximum, minimum);
  if (parseRecord(String(candidate), maximum, minimum) === null) return validCurrent;
  if (validCurrent === null) return candidate;
  return lowerIsBetter ? Math.min(validCurrent, candidate) : Math.max(validCurrent, candidate);
}

// Only tiny numeric records are stored. No identifiers or remote requests.
export function useArcadeRecord(key: string, maximum: number, lowerIsBetter = false, minimum = lowerIsBetter ? 1 : 0) {
  const [best, setBest] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const current = useRef<number | null>(null);
  useEffect(() => {
    const read = () => {
      try {
        const saved = parseRecord(localStorage.getItem(key), maximum, minimum);
        if (saved !== null) current.current = betterRecord(current.current, saved, maximum, lowerIsBetter, minimum);
        setBest(current.current);
      } catch { setUnavailable(true); }
    };
    read();
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) read(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, maximum, lowerIsBetter, minimum]);
  const save = useCallback((value: number) => {
    let next = betterRecord(current.current, value, maximum, lowerIsBetter, minimum);
    if (next === null) return;
    try {
      const saved = parseRecord(localStorage.getItem(key), maximum, minimum);
      if (saved !== null) next = betterRecord(saved, next, maximum, lowerIsBetter, minimum)!;
      localStorage.setItem(key, String(next));
    } catch { setUnavailable(true); }
    current.current = next;
    setBest(next);
  }, [key, maximum, lowerIsBetter, minimum]);
  return { best, save, unavailable };
}
