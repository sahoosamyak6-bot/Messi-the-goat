import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseFavourites, toggleFavourite } from './favourites';
const allowed = ['photo-a', 'photo-b'];

test('favourites reject corrupt, wrong-shaped and unknown stored IDs', () => {
  for (const raw of [null, '', '{', '{}', 'true', '123', '"photo-a"']) assert.deepEqual(parseFavourites(raw, allowed), []);
  assert.deepEqual(parseFavourites('["photo-a","photo-a",null,1,"removed","photo-b"]', allowed), allowed);
});
test('favourites toggle without duplicating or mutating source state', () => {
  const empty: string[] = [];
  const saved = toggleFavourite(empty, 'photo-a', allowed);
  assert.deepEqual(empty, []);
  assert.deepEqual(saved, ['photo-a']);
  assert.deepEqual(toggleFavourite(saved, 'photo-a', allowed), []);
  assert.deepEqual(toggleFavourite(saved, 'photo-b', allowed), allowed);
  assert.deepEqual(toggleFavourite(saved, 'unknown', allowed), saved);
});
test('photo favourites keep original archive indexing and viewer focus fallback', () => {
  const src = readFileSync('src/components/PhotoArchive.tsx', 'utf8');
  assert.match(src, /archivePhotos\.map\(\(item, index\)/);
  assert.match(src, /setSelectedIndex\(index\)/);
  assert.match(src, /Photo \{\(selectedIndex/);
  assert.match(src, /previousFocus\?\.isConnected/);
  assert.match(src, /else archiveRef\.current/);
  assert.match(src, /No saved photographs yet/);
  assert.match(src, /FavouriteButton saved=\{favourites.saved.includes\(selected.id\)/);
});
test('career favourites leave season navigation intact and filter dated moments only', () => {
  const src = readFileSync('src/components/CareerTimeline.tsx', 'utf8');
  assert.match(src, /filterCareerYears\(TIMELINE_YEAR_ITEMS, activeEraFilter\)/);
  assert.match(src, /visibleMilestones.map/);
  assert.match(src, /No saved moments in this category/);
});
test('favourite storage failures are caught and controls remain local and touch-friendly', () => {
  const hook = readFileSync('src/utils/useFavourites.ts', 'utf8');
  assert.equal((hook.match(/catch \{ setUnavailable\(true\); \}/g) || []).length, 2);
  assert.match(hook, /latest.current = next;[\s\S]*setSaved\(next\);[\s\S]*localStorage.setItem/);
  assert.match(hook, /removeEventListener\('storage'/);
  const css = readFileSync('src/components/favourites.css', 'utf8');
  assert.match(css, /min-height: 44px/);
  const controls = readFileSync('src/components/FavouriteControls.tsx', 'utf8');
  assert.match(controls, /Storage unavailable/);
  assert.match(controls, /aria-pressed=\{saved\}/);
  assert.match(controls, /No account or public list/);
});
