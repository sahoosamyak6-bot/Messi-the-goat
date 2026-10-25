import test from 'node:test';
import assert from 'node:assert/strict';
import { archivePhotos, getCareerPhoto } from '../data/archive-photos';
import { getMomentPhoto } from '../data/moment-photos';
import { photoCredits } from '../data/photo-assets';

test('seven distinct new real photographs span four teams and remain fully credited', () => {
  assert.equal(archivePhotos.length, 7);
  assert.equal(new Set(archivePhotos.map(item => item.id)).size, 7);
  assert.equal(new Set(archivePhotos.map(item => item.photo.src)).size, 7);
  assert.equal(new Set(archivePhotos.map(item => item.photo.sourceUrl)).size, 7);
  assert.deepEqual([...new Set(archivePhotos.map(item => item.team))].sort(), ['Argentina', 'FC Barcelona', 'Inter Miami CF', 'Paris Saint-Germain']);
  for (const item of archivePhotos) {
    assert.ok(photoCredits.includes(item.photo));
    assert.ok(item.caption.includes(String(item.year)));
    assert.ok(item.photo.width <= 1280);
  }
});

test('timeline photography stays with the selected club and does not mutate archive order', () => {
  const before = archivePhotos.map(item => item.id);
  assert.equal(getCareerPhoto(2004, 'FC Barcelona')?.year, 2007);
  assert.equal(getCareerPhoto(2009, 'FC Barcelona')?.year, 2009);
  assert.equal(getCareerPhoto(2012, 'FC Barcelona')?.year, 2012);
  assert.equal(getCareerPhoto(2022, 'Paris Saint-Germain')?.team, 'Paris Saint-Germain');
  assert.equal(getCareerPhoto(2023, 'Inter Miami CF')?.year, 2025);
  assert.equal(getCareerPhoto(2022, 'Unknown club'), undefined);
  assert.deepEqual(archivePhotos.map(item => item.id), before);
});

test('new contextual moment photos explicitly distinguish the actual frame from the named event', () => {
  for (const id of ['ronaldinho-piggyback', 'ankara-messi', 'rome-header', 'record-91-goals', 'bernabeu-shirt-500', 'miami-freekick-debut']) {
    assert.match(getMomentPhoto({ id }).contextLabel, /not /);
  }
  assert.match(getMomentPhoto({ id: 'miami-freekick-debut' }).contextLabel, /2025.*not.*2023/);
});
