/**
 * Helper utilities for viewport scroll reveals, stagger timing, and transition styles.
 */

export interface RevealAnimationOptions {
  index?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  prefersReducedMotion?: boolean;
  slideDirection?: 'left' | 'right' | 'up';
}

/**
 * Calculates a progressive stagger delay for chronological elements.
 */
export function calculateStaggerDelay(
  index: number,
  baseDelayMs: number = 90,
  maxDelayMs: number = 600
): number {
  if (index < 0) return 0;
  return Math.min(index * baseDelayMs, maxDelayMs);
}

/**
 * Determines CSS transition and transform properties for scroll reveal.
 * Respects prefersReducedMotion and ensures compositor-only properties.
 */
export function getRevealStyle(
  isVisible: boolean,
  options: RevealAnimationOptions = {}
): React.CSSProperties {
  const {
    index = 0,
    baseDelayMs = 90,
    maxDelayMs = 600,
    prefersReducedMotion = false,
  } = options;

  if (prefersReducedMotion) {
    return {
      opacity: isVisible ? 1 : 0.99,
      transform: 'none',
      transition: 'opacity 200ms ease-out',
    };
  }

  const delay = isVisible ? calculateStaggerDelay(index, baseDelayMs, maxDelayMs) : 0;

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translate3d(0, 0, 0) scale(1)'
      : 'translate3d(-18px, 12px, 0) scale(0.98)',
    transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };
}

/**
 * Generates class names for header and section elements scroll reveal.
 */
export function getSectionRevealClasses(
  isVisible: boolean,
  prefersReducedMotion: boolean = false
): string {
  if (prefersReducedMotion) {
    return 'opacity-100 transform-none';
  }
  return `transition-all duration-700 ease-out ${
    isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6 pointer-events-none'
  }`;
}
