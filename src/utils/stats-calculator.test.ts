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
