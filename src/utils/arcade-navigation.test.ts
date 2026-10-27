import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('arcade is additive and linked in main navigation and footer', () => {
  const app = read('src/App.tsx');
  assert.equal(app.match(/<MessiArcade\s*\/>/g)?.length, 1);
  for (const original of ['LegacyLab', 'PitchVisualizer', 'TrophyCabinet', 'QuotesAndTrivia', 'IconicGallery', 'LatestCoverage']) {
    assert.match(app, new RegExp(`<${original}[\\s/>]`), original);
  }
  assert.match(read('src/components/Navbar.tsx'), /\['Arcade', 'games'\]/);
  assert.match(read('src/components/Footer.tsx'), /\['Messi arcade', 'games'\]/);
});

test('menu breakpoint stays aligned with the expanded navigation row', () => {
  const navbar = read('src/components/Navbar.tsx');
  const css = read('src/index.css');
  assert.match(navbar, /min-width: 1241px/);
  assert.match(css, /min-width:1101px\) and \(max-width:1240px/);
  assert.match(css, /\.nav-links\.open \{ display: flex; \}/);
});
