import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Source contracts supplement, rather than replace, narrow-screen browser QA.
const css = readFileSync(new URL('../components/legacy-lab.css', import.meta.url), 'utf8');
const mobile = css.split('@media (max-width: 560px) {')[1].split('@media (prefers-reduced-motion: reduce)')[0];

test('phone lab uses single-column playbooks and a separate play row', () => {
  assert.match(mobile, /\.ll-playbooks\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(mobile, /\.ll-play\s*\{[^}]*flex-basis:\s*100%/);
  assert.match(mobile, /\.ll-playbook-copy small\s*\{[^}]*font-size:\s*11px/);
});

test('phone lab retains generous step, scrubber and auto-next hit areas', () => {
  assert.match(mobile, /\.ll-controls button\s*\{[^}]*height:\s*44px/);
  assert.match(mobile, /\.ll-step-controls button\s*\{[^}]*width:\s*44px/);
  assert.match(mobile, /\.ll-timeline input\s*\{[^}]*height:\s*44px/);
  assert.match(mobile, /\.ll-auto\s*\{[^}]*min-height:\s*44px/);
  assert.match(mobile, /\.ll-speed select\s*\{[^}]*font-size:\s*16px/);
});
