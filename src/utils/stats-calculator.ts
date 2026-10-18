import type { CareerYearStat, TrophyItem } from '../types/messi';

export function calculateCareerTotals(stats: CareerYearStat[]) {
  return stats.reduce(
    (acc, curr) => {
      acc.totalApps += curr.apps;
      acc.totalGoals += curr.goals;
      acc.totalAssists += curr.assists;
      acc.totalTrophies += curr.trophies;
      acc.totalFreeKicks += curr.freeKickGoals;
      acc.totalPenalties += curr.penaltyGoals;
      acc.totalHatTricks += curr.hatTricks;
      return acc;
    },
    {
      totalApps: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalTrophies: 0,
      totalFreeKicks: 0,
      totalPenalties: 0,
      totalHatTricks: 0,
      goalContribution: 0,
    }
  );
}

export function calculateAverages(goals: number, assists: number, apps: number) {
  if (apps <= 0) return { goalsPerGame: '0.00', assistsPerGame: '0.00', gaPerGame: '0.00' };
  const gpg = (goals / apps).toFixed(2);
  const apg = (assists / apps).toFixed(2);
  const gapg = ((goals + assists) / apps).toFixed(2);
  return {
    goalsPerGame: gpg,
    assistsPerGame: apg,
    gaPerGame: gapg,
  };
}

export function filterStatsByPeriod(stats: CareerYearStat[], startYear: number, endYear: number): CareerYearStat[] {
  return stats.filter((s) => s.year >= startYear && s.year <= endYear);
}

export function getTrophiesByCategory(
  trophies: TrophyItem[],
  category?: 'all' | TrophyItem['category']
): TrophyItem[] {
  if (!category || category === 'all') return trophies;
  return trophies.filter((t) => t.category === category);
}

export function getTotalSilverwareCount(trophies: TrophyItem[], excludeIndividual = true): number {
  return trophies
    .filter((t) => (excludeIndividual ? t.category !== 'individual' : true))
    .reduce((sum, t) => sum + t.count, 0);
}

export function calculateQuizGrade(score: number, total: number) {
  const percentage = (score / total) * 100;
  if (percentage === 100) {
    return {
      title: 'The Ultimate GOAT Scholar',
      badge: '👑 Master Tactician & Rosario Legend',
      message: 'Flawless! You know Lionel Andrés Messi as well as Pep Guardiola and Antonela Roccuzzo!',
    };
  }
  if (percentage >= 75) {
    return {
      title: 'Albiceleste Die-Hard',
      badge: '⭐ World Champion Veteran',
      message: 'Spectacular mastery! You lived through the magical nights in Barcelona, Paris, and Qatar.',
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Camp Nou Faithful',
      badge: '🔵🔴 Blaugrana Aficionado',
      message: 'Great football knowledge! You respect the genius of the magical number 10.',
    };
  }
  return {
    title: 'La Masia Apprentice',
    badge: '🌱 Promising Talent',
    message: 'A solid foundation! Explore the archive and watch the legendary moments to reach GOAT tier.',
  };
}

export function getGoalZone(x: number, y: number): string {
  // x: 0 (defensive) -> 100 (attacking goal)
  // y: 0 (left touchline) -> 100 (right touchline)
  if (x >= 83) {
    if (y < 35) return 'Left 6-Yard Box / Angle';
    if (y > 65) return 'Right 6-Yard Box / Angle';
    return 'Central Penalty Box';
  }
  if (x >= 65) {
    if (y < 30) return 'Left Flank Channel';
    if (y > 70) return 'Right Half-Space Cut-In Zone';
    return 'Edge of Penalty D (Prime Free-Kick Territory)';
  }
  return 'Midfield Launchpad';
}

export function calculatePollPercentages(votes: Record<string, number>): Record<string, number> {
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
  const result: Record<string, number> = {};
  if (totalVotes === 0) {
    Object.keys(votes).forEach((id) => {
      result[id] = 0;
    });
    return result;
  }

  for (const [id, count] of Object.entries(votes)) {
    result[id] = Number(((count / totalVotes) * 100).toFixed(1));
  }
  return result;
}

export function recordPollVote(
  currentVotes: Record<string, number>,
  goalId: string,
  previousVoteId?: string | null
): Record<string, number> {
  const updated = { ...currentVotes };
  if (previousVoteId && previousVoteId !== goalId && updated[previousVoteId] !== undefined) {
    updated[previousVoteId] = Math.max(0, updated[previousVoteId] - 1);
  }
  updated[goalId] = (updated[goalId] || 0) + 1;
  return updated;
}

