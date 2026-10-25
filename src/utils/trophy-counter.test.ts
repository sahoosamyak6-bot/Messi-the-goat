import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TOTAL_MAJOR_TROPHIES,
  MILESTONE_TROPHY_MAP,
  calculateScrollTrophyCount,
  calculateSectionScrollProgress,
  resolveActiveMilestoneTrophyCount,
  getTrophyTierLabel,
} from './trophy-counter';

test('calculateScrollTrophyCount handles bounds and intermediate progress accurately', () => {
  // Edge cases
  assert.strictEqual(calculateScrollTrophyCount(0), 0);
  assert.strictEqual(calculateScrollTrophyCount(-0.5), 0);
  assert.strictEqual(calculateScrollTrophyCount(1), 46);
  assert.strictEqual(calculateScrollTrophyCount(1.5), 46);
  assert.strictEqual(calculateScrollTrophyCount(NaN), 0);

  // Intermediate values
  assert.strictEqual(calculateScrollTrophyCount(0.5), 23);
  assert.strictEqual(calculateScrollTrophyCount(0.25), 12);
  assert.strictEqual(calculateScrollTrophyCount(0.75), 35);

  // Custom min/max bounds
  assert.strictEqual(calculateScrollTrophyCount(0.5, 46, 30), 38);
});

test('calculateSectionScrollProgress computes clamped progress cleanly', () => {
  const sectionTop = 1000;
  const sectionHeight = 2000;
  const viewportHeight = 800;
  const navOffset = 64;

  // Before reaching section
  const progressBefore = calculateSectionScrollProgress(500, sectionTop, sectionHeight, viewportHeight, navOffset);
  assert.strictEqual(progressBefore, 0);

  // Exactly at section top
  const progressStart = calculateSectionScrollProgress(sectionTop - navOffset, sectionTop, sectionHeight, viewportHeight, navOffset);
  assert.strictEqual(progressStart, 0);

  // Past the section bottom
  const progressEnd = calculateSectionScrollProgress(sectionTop + sectionHeight, sectionTop, sectionHeight, viewportHeight, navOffset);
  assert.strictEqual(progressEnd, 1);

  // Invalid height
  assert.strictEqual(calculateSectionScrollProgress(100, 100, 0), 0);
});

test('resolveActiveMilestoneTrophyCount identifies highest visible trophy milestone', () => {
  const result1 = resolveActiveMilestoneTrophyCount(['ach-argentina-top-scorer']);
  assert.strictEqual(result1.count, 30);

  const result2 = resolveActiveMilestoneTrophyCount(['ach-argentina-top-scorer', 'ach-world-cup-2022']);
  assert.strictEqual(result2.count, 42);

  const resultSummit = resolveActiveMilestoneTrophyCount([
    'ach-argentina-top-scorer',
    'ach-world-cup-2022',
    'ach-46-trophies',
  ]);
  assert.strictEqual(resultSummit.count, 46);

  // Empty list falls back to fallbackCount
  const resultEmpty = resolveActiveMilestoneTrophyCount([], 15);
  assert.strictEqual(resultEmpty.count, 15);
});

test('getTrophyTierLabel maps counts to appropriate milestone titles and badges', () => {
  const summit = getTrophyTierLabel(46);
  assert.strictEqual(summit.tier, 'All-Time Summit');
  assert.ok(summit.tagline.includes('46 Major Trophies'));

  const worldCup = getTrophyTierLabel(42);
  assert.strictEqual(worldCup.tier, 'World Champion');

  const albiceleste = getTrophyTierLabel(30);
  assert.strictEqual(albiceleste.tier, 'Albiceleste Era');

  const baseline = getTrophyTierLabel(10);
  assert.strictEqual(baseline.tier, 'Silverware Journey');
});
