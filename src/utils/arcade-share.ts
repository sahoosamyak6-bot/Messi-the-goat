/** Always share the public arcade, never an authenticated preview URL. */
export const ARCADE_PUBLIC_URL = 'https://messi-the-goat.vercel.app/#games';
export function buildArcadeShare(result: string) {
  const text = `${result.trim()}\nMessi Arcade · A personal browser-game result, not a verified leaderboard.`;
  return { title: 'My Messi Arcade result', text, url: ARCADE_PUBLIC_URL };
}
export function arcadeCopyText(result: string): string {
  const data = buildArcadeShare(result);
  return `${data.text}\n${data.url}`;
}
export type NativeShareOutcome = 'completed' | 'cancelled' | 'unavailable' | 'stale';
/** Invoke only from a user gesture. Cancellation must never trigger a clipboard write. */
export async function shareArcadeResult(result: string, share: ((data: { title: string; text: string; url: string }) => Promise<void>) | undefined, signal: AbortSignal): Promise<NativeShareOutcome> {
  if (signal.aborted) return 'stale';
  if (!share) return 'unavailable';
  try {
    await share(buildArcadeShare(result));
    return signal.aborted ? 'stale' : 'completed';
  } catch (error) {
    if (signal.aborted) return 'stale';
    return error && typeof error === 'object' && 'name' in error && error.name === 'AbortError' ? 'cancelled' : 'unavailable';
  }
}
