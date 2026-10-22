import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStaggerDelay,
  getRevealStyle,
  getSectionRevealClasses,
} from './animation-helpers.ts';

test('calculateStaggerDelay computes staggered delays with cap', () => {
  assert.equal(calculateStaggerDelay(0, 100, 500), 0);
  assert.equal(calculateStaggerDelay(1, 100, 500), 100);
  assert.equal(calculateStaggerDelay(3, 100, 500), 300);
  assert.equal(calculateStaggerDelay(6, 100, 500), 500); // capped at 500
  assert.equal(calculateStaggerDelay(-1, 100, 500), 0);
});

test('getRevealStyle provides hidden styles when isVisible is false', () => {
  const hiddenStyle = getRevealStyle(false, { index: 2 });
  assert.equal(hiddenStyle.opacity, 0);
  assert.match(String(hiddenStyle.transform), /translate3d\(-18px/);
});

test('getRevealStyle provides visible styles when isVisible is true', () => {
  const visibleStyle = getRevealStyle(true, { index: 2, baseDelayMs: 80 });
  assert.equal(visibleStyle.opacity, 1);
  assert.equal(visibleStyle.transform, 'translate3d(0, 0, 0) scale(1)');
  assert.match(String(visibleStyle.transition), /160ms/); // index 2 * 80ms = 160ms delay
});

test('getRevealStyle respects prefersReducedMotion', () => {
  const reducedMotionStyle = getRevealStyle(false, { prefersReducedMotion: true });
  assert.equal(reducedMotionStyle.transform, 'none');
});

test('getSectionRevealClasses handles visible and hidden classes', () => {
  const visible = getSectionRevealClasses(true);
  assert.ok(visible.includes('opacity-100'));
  assert.ok(visible.includes('translate-y-0'));

  const hidden = getSectionRevealClasses(false);
  assert.ok(hidden.includes('opacity-0'));
  assert.ok(hidden.includes('translate-y-6'));

  const reduced = getSectionRevealClasses(false, true);
  assert.equal(reduced, 'opacity-100 transform-none');
});
