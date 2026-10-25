/**
 * Pure helper functions for the scroll-driven animated trophy counter
 * in the Achievement Timeline section.
 */

export const TOTAL_MAJOR_TROPHIES = 46;

/**
 * Historical cumulative major silverware counts for the 6 crown achievements
 */
export const MILESTONE_TROPHY_MAP: Record<string, number> = {
  'ach-argentina-top-scorer': 30, // 2016 Copa América Centenario era
  'ach-world-cup-2022': 42,       // 2022 FIFA World Cup in Qatar
  'ach-leagues-cup-2023': 44,     // 2023 Leagues Cup with Inter Miami
  'ach-eighth-ballon-dor': 44,    // 2023 8th Ballon d'Or
  'ach-850-goals': 45,            // 2024 850+ goals landmark
  'ach-46-trophies': 46,          // 2024 Supporters' Shield & Copa América summit
};

/**
 * Calculates continuous trophy count based on section scroll progress (0.0 to 1.0).
 * Scales smoothly from 0 up to maxTrophies (default 46).
 */
export function calculateScrollTrophyCount(
  scrollProgress: number,
  maxTrophies: number = TOTAL_MAJOR_TROPHIES,
  minTrophies: number = 0
): number {
  if (isNaN(scrollProgress) || scrollProgress <= 0) return minTrophies;
  if (scrollProgress >= 1) return maxTrophies;

  const count = minTrophies + scrollProgress * (maxTrophies - minTrophies);
  return Math.min(maxTrophies, Math.max(minTrophies, Math.round(count)));
}

/**
 * Computes clamped scroll progress [0.0, 1.0] of a section within the viewport.
 * Considers viewport height and optional top offset (e.g. navbar height).
 */
export function calculateSectionScrollProgress(
  viewportScrollY: number,
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number = 800,
  navOffset: number = 64
): number {
  if (sectionHeight <= 0) return 0;

  // The scroll starts as the section reaches the top of the viewport (under navbar)
  const effectiveStart = sectionTop - navOffset;
  // The scroll finishes when the bottom of the section reaches the bottom of the viewport
  const scrollableDistance = Math.max(1, sectionHeight - (viewportHeight - navOffset));

  const scrolled = viewportScrollY - effectiveStart;
  const rawProgress = scrolled / scrollableDistance;

  return Math.min(1, Math.max(0, rawProgress));
}

/**
 * Resolves milestone contextual label and trophy count based on active visible items
 */
export function resolveActiveMilestoneTrophyCount(
  visibleItemIds: string[],
  fallbackCount: number = 0
): { count: number; milestoneTitle?: string } {
  if (!visibleItemIds || visibleItemIds.length === 0) {
    return { count: fallbackCount };
  }

  // Find the highest trophy milestone currently visible
  let maxCount = fallbackCount;
  let activeId: string | undefined;

  for (const id of visibleItemIds) {
    const milestoneCount = MILESTONE_TROPHY_MAP[id];
    if (milestoneCount !== undefined && milestoneCount > maxCount) {
      maxCount = milestoneCount;
      activeId = id;
    }
  }

  return { count: maxCount, milestoneTitle: activeId };
}

/**
 * Returns trophy tier label for milestone progress
 */
export function getTrophyTierLabel(count: number): {
  tier: string;
  tagline: string;
  badgeColor: string;
} {
  if (count >= 46) {
    return {
      tier: 'All-Time Summit',
      tagline: '46 Major Trophies · World Record Most Decorated Player',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    };
  }
  if (count >= 42) {
    return {
      tier: 'World Champion',
      tagline: 'FIFA World Cup Glory in Qatar (42+ Trophies)',
      badgeColor: 'text-sky-300 bg-sky-400/10 border-sky-400/30',
    };
  }
  if (count >= 30) {
    return {
      tier: 'Albiceleste Era',
      tagline: 'Barcelona Dynasties to International Silverware',
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    };
  }
  return {
    tier: 'Silverware Journey',
    tagline: 'Tracing the 46-Trophy Summit',
    badgeColor: 'text-slate-300 bg-slate-800 border-slate-700',
  };
}
