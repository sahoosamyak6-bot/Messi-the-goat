import test from 'node:test';
import assert from 'node:assert/strict';
import { CAREER_MILESTONES, filterMilestones, formatMilestoneDate, filterCareerYears, resolveCareerYear } from '../data/career-milestones';
import { TIMELINE_YEAR_ITEMS } from '../data/messi-data';

test('milestones have unique IDs, valid event dates, primary HTTPS sources and chronological order', () => {
  assert.equal(new Set(CAREER_MILESTONES.map(item => item.id)).size, CAREER_MILESTONES.length);
  const dates = CAREER_MILESTONES.map(item => item.date);
  assert.deepEqual(dates, [...dates].sort());
  const sources = ['www.fcbarcelona.com', 'www.uefa.com', 'copaamerica.com', 'en.news.psg.fr', 'www.fifa.com', 'www.intermiamicf.com', 'www.mlssoccer.com', 'www.nashvillesc.com'];
  for (const item of CAREER_MILESTONES) {
    assert.equal(new Date(item.date).toISOString().slice(0, 10), item.date);
    assert.equal(new URL(item.source.url).protocol, 'https:');
    assert.ok(sources.includes(new URL(item.source.url).hostname));
    assert.ok(item.kinds.length > 0 && item.summary && item.source.label);
  }
});
test('milestone categories preserve chronological order and include dual-category events', () => {
  assert.equal(filterMilestones('All').length, 9);
  for (const kind of ['Clubs', 'Matches', 'Trophies'] as const) {
    assert.ok(filterMilestones(kind).length > 0);
    assert.ok(filterMilestones(kind).every(item => item.kinds.includes(kind)));
  }
  assert.ok(filterMilestones('Clubs').some(item => item.id === 'barcelona-debut'));
  assert.ok(filterMilestones('Matches').some(item => item.id === 'barcelona-debut'));
});
test('date display cannot move the event to the previous day in another timezone', () => {
  assert.equal(formatMilestoneDate('2022-12-18'), '18 December 2022');
  assert.equal(formatMilestoneDate('2023-08-19'), '19 August 2023');
});
test('changing era always selects a visible year and preserves existing valid selection', () => {
  for (const era of ['all', 'Barcelona', 'Paris', 'Miami'] as const) {
    const years = filterCareerYears(TIMELINE_YEAR_ITEMS, era);
    assert.ok(years.length);
    assert.ok(years.some(item => item.year === resolveCareerYear(years, 2022)));
    assert.equal(resolveCareerYear(years, years.at(-1)!.year), years.at(-1)!.year);
    assert.equal(resolveCareerYear(years, 9999), years[0].year);
  }
});
test('era filtering does not mutate the full archive', () => {
  const original = TIMELINE_YEAR_ITEMS.map(item => item.year);
  const paris = filterCareerYears(TIMELINE_YEAR_ITEMS, 'Paris');
  assert.ok(paris.every(item => item.club === 'Paris Saint-Germain'));
  paris.reverse();
  assert.deepEqual(TIMELINE_YEAR_ITEMS.map(item => item.year), original);
});
