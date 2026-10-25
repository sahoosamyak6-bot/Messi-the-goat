import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
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
  assert.equal(photoCredits.length, 5);
  assert.equal(photoAssets.portrait.license, 'CC BY-SA 2.0');
  assert.match(photoAssets.portrait.credit, /Christopher Johnson.*CHUCAO/);
});
