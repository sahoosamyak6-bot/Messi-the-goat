export interface CareerYearStat {
  year: number;
  club: string;
  apps: number;
  goals: number;
  assists: number;
  trophies: number;
  freeKickGoals: number;
  penaltyGoals: number;
  hatTricks: number;
  majorHonors: string[];
}

export interface TrophyItem {
  id: string;
  name: string;
  category: 'international' | 'continental' | 'domestic_league' | 'domestic_cup' | 'individual';
  count: number;
  years: number[];
  team: 'Argentina' | 'FC Barcelona' | 'Paris Saint-Germain' | 'Inter Miami' | 'Individual';
  description: string;
  significance: string;
  highlightYear: number;
  highlightDetail: string;
}

export interface Era {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  team: string;
  jerseyNumber: string;
  summary: string;
  quote: {
    text: string;
    author: string;
  };
  metrics: {
    matches: number;
    goals: number;
    assists: number;
    trophies: number;
  };
  keyMilestones: string[];
  definingMatch: {
    title: string;
    date: string;
    opponent: string;
    score: string;
    impact: string;
  };
  imageTag: string;
  accentColor: string;
}

export interface IconicGoal {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  competition: string;
  opponent: string;
  team: string;
  minute: string;
  type: 'Solo Dribble' | 'Long Range Free-Kick' | 'Precision Chip' | 'Acrobatic Header' | 'Clutch Winner' | 'Team Play';
  distanceMeters: number;
  speedKmh?: number;
  pitchTrajectory: {
    startX: number; // 0 to 100 percentage of pitch
    startY: number; // 0 to 100
    dribblePoints: Array<{ x: number; y: number; label?: string }>;
    shotTarget: { x: number; y: number }; // goal coordinates
    assistPlayer?: string;
  };
  commentarySnippet: string;
  commentator: string;
  context: string;
  significance: string;
}

export interface LegendQuote {
  id: string;
  quote: string;
  speaker: string;
  role: string;
  category: 'managers' | 'rivals' | 'teammates' | 'legends';
  year?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'records' | 'world_cup' | 'barcelona' | 'early_life';
}

export interface TimelineYearItem {
  year: number;
  seasonLabel: string;
  club: 'FC Barcelona' | 'Paris Saint-Germain' | 'Inter Miami CF';
  eraBadge: string;
  milestoneTitle: string;
  shortSummary: string;
  detailedBio: string;
  stats: {
    apps: number;
    goals: number;
    assists: number;
    ga: number;
    gpg: string;
    apg: string;
  };
  trophiesWon: string[];
  definingMoment: string;
  quote?: {
    text: string;
    speaker: string;
  };
  isMajorPeak: boolean;
}

export interface GoalPollItem {
  id: string;
  title: string;
  year: number;
  match: string;
  competition: string;
  description: string;
  distance: string;
  initialVotes: number;
  badge: string;
}

export interface AchievementItem {
  id: string;
  order: number;
  year: number;
  dateStr: string;
  category: 'international' | 'world_cup' | 'club_milestone' | 'individual' | 'world_record';
  title: string;
  summary: string;
  details: string;
  badge: string;
  metrics: {
    label: string;
    value: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}


