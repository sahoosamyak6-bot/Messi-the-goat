import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCareerTotals,
  calculateAverages,
  filterStatsByPeriod,
  getTrophiesByCategory,
  getTotalSilverwareCount,
  calculateQuizGrade,
  getGoalZone,
  calculatePollPercentages,
  recordPollVote,
  getLocalPollResults,
  sortAchievementsChronologically,
} from './stats-calculator.ts';
import type { CareerYearStat, TrophyItem } from '../types/messi.ts';

const mockStats: CareerYearStat[] = [
  {
    year: 2011,
    club: 'FC Barcelona',
    apps: 70,
    goals: 73,
    assists: 29,
    trophies: 4,
    freeKickGoals: 3,
    penaltyGoals: 14,
    hatTricks: 10,
    majorHonors: ['UEFA Champions League', 'La Liga', 'FIFA Club World Cup'],
  },
  {
    year: 2012,
    club: 'FC Barcelona',
    apps: 69,
    goals: 91,
    assists: 22,
    trophies: 1,
    freeKickGoals: 7,
    penaltyGoals: 14,
    hatTricks: 9,
    majorHonors: ['Copa del Rey', 'Ballon dOr (Record 91 Goals)'],
  },
];

const mockTrophies: TrophyItem[] = [
  {
    id: 'wc-2022',
    name: 'FIFA World Cup',
    category: 'international',
    count: 1,
    years: [2022],
    team: 'Argentina',
    description: 'The pinnacle of international football',
    significance: 'Cemented status as the undisputed greatest of all time',
    highlightYear: 2022,
    highlightDetail: '7 goals, 3 assists, Golden Ball winner',
  },
  {
    id: 'bdor',
    name: "Ballon d'Or",
    category: 'individual',
    count: 8,
    years: [2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023],
    team: 'Individual',
    description: 'Awarded to the best footballer in the world',
    significance: 'All-time world record',
    highlightYear: 2023,
    highlightDetail: '8th Ballon dOr following World Cup triumph',
  },
];

test('calculateCareerTotals sums appearances, goals, and assists accurately', () => {
  const totals = calculateCareerTotals(mockStats);
  assert.equal(totals.totalApps, 139);
  assert.equal(totals.totalGoals, 164);
  assert.equal(totals.totalAssists, 51);
  assert.equal(totals.totalTrophies, 5);
  assert.equal(totals.totalFreeKicks, 10);
  assert.equal(totals.goalContribution, 215);
});

test('calculateAverages calculates per game ratios to two decimal places', () => {
  const averages = calculateAverages(91, 22, 69);
  assert.equal(averages.goalsPerGame, '1.32');
  assert.equal(averages.assistsPerGame, '0.32');
  assert.equal(averages.gaPerGame, '1.64');
});

test('filterStatsByPeriod filters by calendar range', () => {
  const filtered = filterStatsByPeriod(mockStats, 2012, 2012);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].year, 2012);
});

test('getTrophiesByCategory filters categories and respects all', () => {
  const international = getTrophiesByCategory(mockTrophies, 'international');
  assert.equal(international.length, 1);
  assert.equal(international[0].id, 'wc-2022');

  const all = getTrophiesByCategory(mockTrophies, 'all');
  assert.equal(all.length, 2);
});

test('getTotalSilverwareCount excludes individual honors when instructed', () => {
  const teamSilverware = getTotalSilverwareCount(mockTrophies, true);
  assert.equal(teamSilverware, 1);

  const allSilverware = getTotalSilverwareCount(mockTrophies, false);
  assert.equal(allSilverware, 9);
});

test('calculateQuizGrade provides correct tiers', () => {
  const perfect = calculateQuizGrade(8, 8);
  assert.equal(perfect.title, 'The Ultimate GOAT Scholar');

  const solid = calculateQuizGrade(6, 8);
  assert.equal(solid.title, 'Albiceleste Die-Hard');
});

test('getGoalZone classifies coordinates accurately', () => {
  const penaltyBoxZone = getGoalZone(90, 50);
  assert.equal(penaltyBoxZone, 'Central Penalty Box');

  const cutInZone = getGoalZone(70, 75);
  assert.equal(cutInZone, 'Right Half-Space Cut-In Zone');
});

test('calculatePollPercentages computes exact percentage distribution', () => {
  const votes = { g1: 50, g2: 30, g3: 20 };
  const percentages = calculatePollPercentages(votes);
  assert.equal(percentages.g1, 50);
  assert.equal(percentages.g2, 30);
  assert.equal(percentages.g3, 20);
});

test('recordPollVote updates counts and switches previous vote', () => {
  const initial = { g1: 10, g2: 5 };
  const updated = recordPollVote(initial, 'g2', 'g1');
  assert.equal(updated.g1, 9);
  assert.equal(updated.g2, 6);
});

test('sortAchievementsChronologically sorts items by year and order', () => {
  const unsorted = [
    { id: 'b', order: 2, year: 2023 },
    { id: 'a', order: 1, year: 2016 },
    { id: 'c', order: 1, year: 2023 },
    { id: 'd', order: 1, year: 2024 },
  ];
  const sorted = sortAchievementsChronologically(unsorted);
  assert.equal(sorted[0].id, 'a');
  assert.equal(sorted[1].id, 'c');
  assert.equal(sorted[2].id, 'b');
  assert.equal(sorted[3].id, 'd');
});



test('calculateCareerTotals returns zero goal contributions for empty input', () => {
  assert.equal(calculateCareerTotals([]).goalContribution, 0);
});

test('recordPollVote does not count a repeated selection twice', () => {
  const initial = { g1: 10, g2: 5 };
  const firstVote = recordPollVote(initial, 'g1');
  assert.deepEqual(recordPollVote(firstVote, 'g1', 'g1'), { g1: 11, g2: 5 });
  assert.deepEqual(initial, { g1: 10, g2: 5 });
});

test('local poll restores exactly one saved choice after reload', () => {
  const baseline = { g1: 10, g2: 5 };
  const expected = { g1: 11, g2: 5 };
  assert.deepEqual(getLocalPollResults(baseline, 'g1'), expected);
  assert.deepEqual(getLocalPollResults(baseline, 'g1'), expected);
  assert.deepEqual(baseline, { g1: 10, g2: 5 });
});

test('local poll switches and clears choices without changing the baseline', () => {
  const baseline = { g1: 10, g2: 5 };
  assert.deepEqual(getLocalPollResults(baseline, 'g1'), { g1: 11, g2: 5 });
  assert.deepEqual(getLocalPollResults(baseline, 'g2'), { g1: 10, g2: 6 });
  assert.deepEqual(getLocalPollResults(baseline, null), baseline);
  assert.deepEqual(getLocalPollResults(baseline, 'g1'), { g1: 11, g2: 5 });
});

test('local poll ignores stale or malformed saved choice IDs', () => {
  const baseline = { g1: 0, g2: 5 };
  for (const invalid of ['', 'removed-goal', '__proto__', 'constructor']) {
    assert.deepEqual(getLocalPollResults(baseline, invalid), baseline);
  }
  assert.deepEqual(getLocalPollResults(baseline, 'g1'), { g1: 1, g2: 5 });
  assert.deepEqual(getLocalPollResults({}, 'g1'), {});
});

test('poll percentages handle an empty poll and zero votes', () => {
  assert.deepEqual(calculatePollPercentages({}), {});
  assert.deepEqual(calculatePollPercentages({ g1: 0, g2: 0 }), { g1: 0, g2: 0 });
});
