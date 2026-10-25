import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSearchText,
  buildSearchIndex,
  searchArchive,
  splitTextForHighlight,
} from './searchIndex';

test('normalizeSearchText strips accents and converts to lower case', () => {
  assert.equal(normalizeSearchText('Lionel Andrés Messi'), 'lionel andres messi');
  assert.equal(normalizeSearchText('Copa América'), 'copa america');
  assert.equal(normalizeSearchText('Santiago Bernabéu'), 'santiago bernabeu');
  assert.equal(normalizeSearchText('   BALLON D’OR   '), 'ballon d’or');
});

test('buildSearchIndex aggregates trophies, years, milestones, and biography chapters', () => {
  const index = buildSearchIndex();
  assert.ok(index.length > 50, `Expected index to have >50 items, got ${index.length}`);

  const hasTrophies = index.some((i) => i.category === 'trophy');
  const hasYears = index.some((i) => i.category === 'year');
  const hasMilestones = index.some((i) => i.category === 'milestone');
  const hasBio = index.some((i) => i.category === 'biography');
  const hasGoals = index.some((i) => i.category === 'goal');

  assert.ok(hasTrophies, 'Index should include trophies');
  assert.ok(hasYears, 'Index should include years');
  assert.ok(hasMilestones, 'Index should include milestones');
  assert.ok(hasBio, 'Index should include biography');
  assert.ok(hasGoals, 'Index should include iconic goals');
});

test('searchArchive finds 2012 calendar year record and season stats', () => {
  const results = searchArchive('2012');
  assert.ok(results.length > 0, 'Should return results for 2012');

  const topItems = results.slice(0, 5).map((r) => r.item);
  const found91GoalsOr2012Year = topItems.some(
    (item) => item.year === 2012 || item.title.includes('2012') || item.yearsWon?.includes(2012)
  );
  assert.ok(found91GoalsOr2012Year, '2012 query should prominently feature 2012 milestones or season');
});

test('searchArchive finds World Cup silverware and milestones', () => {
  const results = searchArchive('World Cup');
  assert.ok(results.length > 0, 'Should find World Cup entries');

  const topItem = results[0].item;
  const matchesWorldCup =
    topItem.title.toLowerCase().includes('world cup') ||
    topItem.description.toLowerCase().includes('world cup');
  assert.ok(matchesWorldCup, 'Top result should match World Cup');
});

test('searchArchive finds Ballon d\'Or with accent-tolerant matching', () => {
  const resultsWithApostrophe = searchArchive("Ballon d'Or");
  assert.ok(resultsWithApostrophe.length > 0, "Should find Ballon d'Or");

  const resultsWithoutApostrophe = searchArchive('ballon dor');
  assert.ok(resultsWithoutApostrophe.length > 0, 'Should find ballon dor without apostrophe');
});

test('searchArchive finds biographical milestones like napkin contract', () => {
  const results = searchArchive('napkin');
  assert.ok(results.length > 0, 'Should find napkin milestone');

  const foundBioOrRexach = results.some(
    (r) =>
      r.item.category === 'biography' ||
      r.item.title.toLowerCase().includes('napkin') ||
      r.item.description.toLowerCase().includes('napkin')
  );
  assert.ok(foundBioOrRexach, 'Napkin search should find biography chapter or milestone');
});

test('searchArchive category filter isolates results to requested category', () => {
  const trophyOnly = searchArchive('Argentina', 'trophy');
  assert.ok(trophyOnly.length > 0, 'Should find Argentina trophies');
  for (const res of trophyOnly) {
    assert.equal(res.item.category, 'trophy');
  }

  const bioOnly = searchArchive('Barcelona', 'biography');
  assert.ok(bioOnly.length > 0, 'Should find Barcelona biography chapters');
  for (const res of bioOnly) {
    assert.equal(res.item.category, 'biography');
  }
});

test('splitTextForHighlight splits matching tokens correctly', () => {
  const text = 'Lionel Messi won the 2022 World Cup';
  const query = '2022 World';
  const segments = splitTextForHighlight(text, query);

  const matchedTexts = segments.filter((s) => s.isMatch).map((s) => s.text);
  assert.deepEqual(matchedTexts, ['2022', 'World']);

  const reconstructed = segments.map((s) => s.text).join('');
  assert.equal(reconstructed, text);
});
