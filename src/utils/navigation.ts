/** A malformed bookmark must never prevent the application from mounting. */
export function sectionFromHash(hash: string): string {
  const value = hash.startsWith('#') ? hash.slice(1) : hash;
  try { return decodeURIComponent(value); } catch { return value; }
}

/** Preserve the browser's open-in-new-tab/window and download link gestures. */
export function isPlainPrimaryClick(event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean }): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.defaultPrevented;
}
