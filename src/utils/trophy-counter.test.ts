import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AchievementTimeline } from '../components/AchievementTimeline';
import {
  TOTAL_MAJOR_TROPHIES,
  TROPHY_ARCHIVE_YEAR,
  calculateScrollTrophyCount,
  calculateSectionScrollProgress,
  getNextTrophyCount,
  getTrophyTierLabel,
} from './trophy-counter';

test('archive constants describe a historical snapshot, not a live total', () => {
  assert.equal(TOTAL_MAJOR_TROPHIES, 46);
  assert.equal(TROPHY_ARCHIVE_YEAR, 2024);
});

test('scroll count clamps bounds, rounds, and supports a custom range', () => {
  assert.equal(calculateScrollTrophyCount(0), 0);
  assert.equal(calculateScrollTrophyCount(-0.5), 0);
  assert.equal(calculateScrollTrophyCount(1), 46);
  assert.equal(calculateScrollTrophyCount(1.5), 46);
  assert.equal(calculateScrollTrophyCount(0.5), 23);
  assert.equal(calculateScrollTrophyCount(0.25), 12);
  assert.equal(calculateScrollTrophyCount(0.75), 35);
  assert.equal(calculateScrollTrophyCount(0.5, 46, 30), 38);
});

test('invalid scroll input and trophy bounds always yield bounded finite integers', () => {
  for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.equal(calculateScrollTrophyCount(invalid), 0);
    assert.equal(calculateScrollTrophyCount(0.5, invalid), 23);
    assert.equal(calculateScrollTrophyCount(0.5, 46, invalid), 23);
  }
  assert.equal(calculateScrollTrophyCount(0.5, 5, 12), 5);
  assert.equal(calculateScrollTrophyCount(0.5, -1, -10), 0);
  assert.equal(calculateScrollTrophyCount(0.5, 10.4, 1.2), 6);
});

test('section progress starts below the navbar and ends at the viewport bottom', () => {
  assert.equal(calculateSectionScrollProgress(500, 1000, 2000, 800, 64), 0);
  assert.equal(calculateSectionScrollProgress(936, 1000, 2000, 800, 64), 0);
  assert.equal(calculateSectionScrollProgress(1568, 1000, 2000, 800, 64), 0.5);
  assert.equal(calculateSectionScrollProgress(2200, 1000, 2000, 800, 64), 1);
  assert.equal(calculateSectionScrollProgress(3000, 1000, 2000, 800, 64), 1);
});

test('section progress handles invalid geometry and sections shorter than the viewport', () => {
  const valid = [1000, 1000, 2000, 800, 64] as const;
  for (const invalid of [NaN, Infinity, -Infinity]) {
    for (let position = 0; position < valid.length; position += 1) {
      const values = [...valid] as number[];
      values[position] = invalid;
      assert.equal(calculateSectionScrollProgress(values[0], values[1], values[2], values[3], values[4]), 0);
    }
  }
  assert.equal(calculateSectionScrollProgress(100, 100, 0), 0);
  assert.equal(calculateSectionScrollProgress(100, 100, -1), 0);
  assert.equal(calculateSectionScrollProgress(100, 100, 2000, 0), 0);
  assert.equal(calculateSectionScrollProgress(935, 1000, 300, 800, 64), 0);
  assert.equal(calculateSectionScrollProgress(937, 1000, 300, 800, 64), 1);
  assert.equal(calculateSectionScrollProgress(1000, 1000, 2000, 800, -64), 0);
});

test('ticker converges in both directions and stops at every possible target', () => {
  for (let start = 0; start <= TOTAL_MAJOR_TROPHIES; start += 1) {
    for (let target = 0; target <= TOTAL_MAJOR_TROPHIES; target += 1) {
      let current = start;
      let steps = 0;
      while (current !== target && steps < 50) {
        const next = getNextTrophyCount(current, target);
        assert.ok(Math.abs(target - next) < Math.abs(target - current));
        assert.ok(next >= Math.min(start, target) && next <= Math.max(start, target));
        current = next;
        steps += 1;
      }
      assert.equal(current, target);
      assert.equal(getNextTrophyCount(current, target), target);
      assert.ok(steps < 50);
    }
  }
});

test('ticker steps tolerate nonfinite inputs', () => {
  for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.ok(Number.isFinite(getNextTrophyCount(invalid, 46)));
    assert.ok(Number.isFinite(getNextTrophyCount(0, invalid)));
  }
});

test('counter labels do not infer historical eras from scroll depth', () => {
  for (const count of [NaN, Infinity, -Infinity, 0, 10, 30, 42, 45]) {
    const label = getTrophyTierLabel(count);
    assert.equal(label.tier, 'Illustrative count-up');
    assert.match(label.tagline, /not a historical running total/);
    assert.doesNotMatch(label.tagline, /World Champion|Qatar|Barcelona|World Record/);
  }
  assert.equal(getTrophyTierLabel(46).tier, 'Count-up complete');
  assert.match(getTrophyTierLabel(46).tagline, /46-title archive · Through 2024/);
});

// Keep the snapshot and illustrative labels present even before JavaScript runs.
test('counter markup retains the archive total and clearly distinguishes reading progress', () => {
  const html = renderToStaticMarkup(createElement(AchievementTimeline));
  assert.match(html, /Illustrative trophy count-up, 46-title archive through 2024/);
  assert.match(html, /46-title archive through 2024 · Not a live total/);
  assert.match(html, /Scroll progress, not a historical running total/);
  assert.match(html, /role="progressbar"[^>]*aria-valuenow="0"/);
  assert.doesNotMatch(html, /Scroll updates count in real time|Major Trophies Won/);
  const section = html.match(/<section[^>]*id="achievement-timeline"[^>]*>/)?.[0];
  assert.ok(section);
  assert.doesNotMatch(section, /overflow-hidden/);
  assert.match(section, /padding-top:0/);
});
