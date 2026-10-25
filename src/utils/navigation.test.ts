import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlainPrimaryClick, sectionFromHash } from './navigation';

test('bookmark parsing tolerates malformed escapes and decodes valid anchors', () => {
  assert.equal(sectionFromHash('#career-timeline'), 'career-timeline');
  assert.equal(sectionFromHash('#photo%2Dcredits'), 'photo-credits');
  assert.equal(sectionFromHash('#%'), '%');
  assert.equal(sectionFromHash(''), '');
});
test('section links preserve modified and non-primary browser gestures', () => {
  const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
  assert.equal(isPlainPrimaryClick(click), true);
  for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) assert.equal(isPlainPrimaryClick({ ...click, [key]: true }), false);
  assert.equal(isPlainPrimaryClick({ ...click, button: 1 }), false);
});
