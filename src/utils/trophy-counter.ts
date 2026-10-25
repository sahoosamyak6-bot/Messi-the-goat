/**
 * Helpers for an illustrative scroll count-up, not historical trophy totals at
 * individual milestones. The archive's 46-title snapshot ends in 2024.
 */
export const TOTAL_MAJOR_TROPHIES = 46;
export const TROPHY_ARCHIVE_YEAR = 2024;

/** Scales finite scroll progress to a non-negative integer count. */
export function calculateScrollTrophyCount(
  scrollProgress: number,
  maxTrophies: number = TOTAL_MAJOR_TROPHIES,
  minTrophies: number = 0
): number {
  const maximum = Number.isFinite(maxTrophies)
    ? Math.max(0, Math.round(maxTrophies))
    : TOTAL_MAJOR_TROPHIES;
  const minimum = Number.isFinite(minTrophies)
    ? Math.min(maximum, Math.max(0, Math.round(minTrophies)))
    : 0;
  const progress = Number.isFinite(scrollProgress)
    ? Math.min(1, Math.max(0, scrollProgress))
    : 0;

  return Math.round(minimum + progress * (maximum - minimum));
}

/**
 * Clamped section reading progress. Invalid geometry returns zero. A section
 * shorter than the usable viewport completes once its top passes the navbar.
 */
export function calculateSectionScrollProgress(
  viewportScrollY: number,
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number = 800,
  navOffset: number = 64
): number {
  if (![viewportScrollY, sectionTop, sectionHeight, viewportHeight, navOffset].every(Number.isFinite)
    || sectionHeight <= 0 || viewportHeight <= 0) return 0;

  const offset = Math.min(viewportHeight, Math.max(0, navOffset));
  const effectiveStart = sectionTop - offset;
  const scrollableDistance = Math.max(1, sectionHeight - (viewportHeight - offset));
  return Math.min(1, Math.max(0, (viewportScrollY - effectiveStart) / scrollableDistance));
}

/** One bounded animation step. Integer steps always converge without overshoot. */
export function getNextTrophyCount(current: number, target: number): number {
  const nextTarget = calculateScrollTrophyCount(1, target);
  const previous = Number.isFinite(current) ? Math.max(0, Math.round(current)) : 0;
  const difference = nextTarget - previous;
  if (difference === 0) return nextTarget;
  const step = Math.abs(difference) > 4 ? Math.round(difference * 0.35) : Math.sign(difference);
  return difference > 0
    ? Math.min(nextTarget, previous + step)
    : Math.max(nextTarget, previous + step);
}

/** Describes reading progress only; it never assigns a historical era to a count. */
export function getTrophyTierLabel(count: number): { tier: string; tagline: string } {
  if (Number.isFinite(count) && count >= TOTAL_MAJOR_TROPHIES) {
    return { tier: 'Count-up complete', tagline: `${TOTAL_MAJOR_TROPHIES}-title archive · Through ${TROPHY_ARCHIVE_YEAR}` };
  }
  return { tier: 'Illustrative count-up', tagline: 'Scroll progress, not a historical running total' };
}
