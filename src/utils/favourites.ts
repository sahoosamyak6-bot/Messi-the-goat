/** Browser-local favourites contain known IDs only, never user-provided markup. */
export function parseFavourites(raw: string | null, allowedIds: readonly string[]): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const allowed = new Set(allowedIds);
    return [...new Set(parsed.filter((value): value is string => typeof value === 'string' && allowed.has(value)))];
  } catch { return []; }
}
export function toggleFavourite(ids: readonly string[], id: string, allowedIds: readonly string[]): string[] {
  if (!allowedIds.includes(id)) return [...ids];
  return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
}
