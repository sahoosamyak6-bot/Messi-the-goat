import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { photoAssets, photoCredits, photoSrcSet, photoWidths } from '../data/photo-assets';

for (const [name, photo] of Object.entries(photoAssets)) {
  test(`${name}: responsive candidates exist, stay smaller and preserve original fallback`, () => {
    const widths = photoWidths(photo);
    assert.equal(widths.at(-1), photo.width);
    assert.deepEqual(widths, [...new Set(widths)].sort((a, b) => a - b));
    assert.equal(photoSrcSet(photo).split(', ').length, widths.length);
    const originalBytes = statSync(`public${photo.src}`).size;
    for (const candidate of photoSrcSet(photo).split(', ')) {
      const [src, descriptor] = candidate.split(' ');
      assert.ok(existsSync(`public${src}`), src);
      assert.ok(Number.parseInt(descriptor) <= photo.width);
      if (src !== photo.src) assert.ok(statSync(`public${src}`).size < originalBytes);
    }
  });
  test(`${name}: source, license and adaptation details remain attributable`, () => {
    assert.ok(photo.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
    assert.ok(photo.licenseUrl.startsWith('https://creativecommons.org/licenses/'));
    assert.ok(photo.credit.length > 5);
    assert.ok(photo.modifications.includes('WebP'));
    assert.ok(photo.alt.includes('Messi'));
  });
}

test('all five archive photos remain credited, including share-alike derivative', () => {
  assert.ok(photoCredits.length >= 11);
  for (const key of ['hero', 'argentina', 'barcelona', 'worldCup', 'portrait']) assert.ok(key in photoAssets);
  assert.equal(photoAssets.portrait.license, 'CC BY-SA 2.0');
  assert.match(photoAssets.portrait.credit, /Christopher Johnson.*CHUCAO/);
});

const originalDigests = {
  "/photos/messi-argentina-celebration-2022.webp": "abe9a6006f52d16f76f78f4426aa274b71981872697c7ebf144cf731dd7d5c91",
  "/photos/messi-argentina-hero.webp": "1a15082f6574963d60f2e44077075274509e9c49d09aab1ff7d8fc85ba3a73c4",
  "/photos/messi-argentina-2022.webp": "a922cf5df881d38b29082da7764eb0c795a452f50cefd0154cc563836679d782",
  "/photos/messi-barcelona-final-2015.webp": "b2b6c7d2525d7f0c775b7ecd748dbb217157f953f0f8bf9af6d79c02492e56ad",
  "/photos/messi-barcelona-2011.webp": "a4bde29c94c7d184113db1ad72b9656ade40922584110481a79238c3cf9e1895"
};
test('the five original photographs are preserved byte-for-byte', () => {
  for (const [src, digest] of Object.entries(originalDigests)) {
    assert.equal(createHash('sha256').update(readFileSync(`public${src}`)).digest('hex'), digest);
  }
});
