import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mobile shortcuts keep native links, existing navigation and search access', () => {
  const component = readFileSync('src/components/MobileQuickNav.tsx', 'utf8');
  assert.match(component, /isPlainPrimaryClick/);
  assert.match(component, /onNavigate\(id\)/);
  assert.match(component, /href=\{`#\$\{id\}`\}/);
  assert.match(component, /onClick=\{onOpenSearch\}/);
  for (const id of ['gallery', 'career-timeline', 'games']) assert.ok(component.includes(`'${id}'`));
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.match(app, /<MobileQuickNav onNavigate=\{handleNavigate\}/);
  assert.match(app, /target\.focus\(\{ preventScroll: true \}\)/);
});

test('mobile shortcuts are in-flow, touch sized and adapt without overflow', () => {
  const css = readFileSync('src/components/mobile-quick-nav.css', 'utf8');
  assert.match(css, /max-width: 700px/);
  assert.match(css, /min-height: 46px/);
  assert.match(css, /minmax\(0, 1fr\)/);
  assert.match(css, /max-width: 360px/);
  assert.doesNotMatch(css, /position:\s*(fixed|sticky)/);
});
