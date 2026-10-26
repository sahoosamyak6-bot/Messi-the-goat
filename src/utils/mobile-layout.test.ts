import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (name: string) => readFileSync(`src/components/${name}.tsx`, 'utf8');

test('search uses a dynamic viewport cap and independently scrollable results', () => {
  const search = source('GlobalSearchOverlay');
  assert.match(search, /max-h-\[calc\(100dvh_-_24px\)\]/);
  assert.match(search, /min-h-0 flex-1 overflow-y-auto overscroll-contain/);
  assert.doesNotMatch(search, /85vh/);
});

test('search input does not force narrow layouts wider or use sub-16px mobile type', () => {
  const search = source('GlobalSearchOverlay');
  assert.match(search, /min-w-0 flex-1 w-full bg-transparent[^\n]*text-base/);
  assert.match(search, /min-w-11 min-h-11 grid place-items-center rounded-full/);
  assert.match(search, /min-w-11 min-h-11 grid place-items-center rounded-2xl/);
});

test('moment card fits within dynamic viewport padding and keeps close button reachable', () => {
  const modal = source('MomentModal');
  assert.match(modal, /max-h-\[calc\(100dvh_-_32px\)\]/);
  assert.doesNotMatch(modal, /90vh|my-8/);
  assert.match(modal, /min-w-0 flex flex-wrap items-center/);
  assert.match(modal, /shrink-0 min-w-11 min-h-11/);
});

test('small-header controls and navigation retain 44px minimum touch targets', () => {
  const css = readFileSync('src/index.css', 'utf8');
  assert.match(css, /\.header-tools \.icon-button \{ width: 44px; min-width: 44px; min-height: 44px;/);
  assert.match(css, /\.nav-links > a, \.nav-links > \.mobile-nav-extra \{ min-height: 44px;/);
});
