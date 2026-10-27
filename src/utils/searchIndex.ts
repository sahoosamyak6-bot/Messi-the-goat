import {
  BIOGRAPHY_CHAPTERS,
  SEASON_BY_SEASON_STATS,
  TROPHIES_DATA,
  ACHIEVEMENT_TIMELINE_ITEMS,
  ICONIC_MOMENTS,
  ICONIC_GOALS_TACTICAL,
  TIMELINE_YEAR_ITEMS,
  IconicMoment,
} from '../data/messi-data';

export type SearchCategory = 'year' | 'trophy' | 'milestone' | 'biography' | 'goal' | 'game' | 'section';

export interface SearchAction {
  type: 'section' | 'moment' | 'season' | 'trophy' | 'chapter';
  sectionId: string;
  payload?: any;
}

export interface SearchIndexItem {
  id: string;
  category: SearchCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  year?: number;
  yearsWon?: number[];
  badge: string;
  teamOrContext?: string;
  tags: string[];
  action: SearchAction;
  originalMoment?: IconicMoment;
}

export interface SearchResult {
  item: SearchIndexItem;
  score: number;
}

/**
 * Remove diacritics and standardize accents for flexible multilingual search
 * (e.g. "América" -> "america", "Bernabéu" -> "bernabeu")
 */
export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Builds the comprehensive search index combining all aspects of the chronicle
 */
export function buildSearchIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  // 1. Trophies & Silverware (46 titles and honors)
  TROPHIES_DATA.forEach((trophy) => {
    const yearsStr = trophy.years.join(', ');
    const tags = [
      trophy.name,
      trophy.category,
      trophy.team,
      `${trophy.count} titles`,
      `${trophy.count}x`,
      ...trophy.years.map((y) => y.toString()),
      'trophy',
      'silverware',
      'champion',
      'title',
      'honor',
    ];
    if (trophy.id.includes('ballon')) {
      tags.push("ballon d'or", 'golden ball', 'france football', 'individual goat');
    }
    if (trophy.name.toLowerCase().includes('world cup')) {
      tags.push('fifa', 'qatar', 'lusail', 'golden ball', 'argentina champion');
    }

    items.push({
      id: `trophy-${trophy.id}`,
      category: 'trophy',
      categoryLabel: 'Silverware & Honors',
      title: trophy.name,
      subtitle: `${trophy.count}x Winner · ${trophy.team} (${yearsStr})`,
      description: `${trophy.description} ${trophy.significance}`,
      year: trophy.highlightYear,
      yearsWon: trophy.years,
      badge: `${trophy.count} TITLES`,
      teamOrContext: trophy.team,
      tags,
      action: {
        type: 'trophy',
        sectionId: 'trophies',
        payload: { trophyId: trophy.id, trophyName: trophy.name },
      },
    });
  });

  // 2. Crown Milestone Achievements (The 6 monumental milestones)
  ACHIEVEMENT_TIMELINE_ITEMS.forEach((ach) => {
    items.push({
      id: `achievement-${ach.id}`,
      category: 'milestone',
      categoryLabel: 'Crown Milestone',
      title: `${ach.year}: ${ach.title}`,
      subtitle: `${ach.dateStr} · ${ach.badge} · ${ach.metrics.label}: ${ach.metrics.value}`,
      description: `${ach.summary} ${ach.details}`,
      year: ach.year,
      badge: ach.metrics.value,
      teamOrContext: ach.category.replace('_', ' ').toUpperCase(),
      tags: [
        ach.title,
        ach.year.toString(),
        ach.dateStr,
        ach.badge,
        ach.metrics.label,
        ach.metrics.value,
        'milestone',
        'record',
        'achievement',
        'crown',
      ],
      action: {
        type: 'section',
        sectionId: 'achievement-timeline',
        payload: { achievementId: ach.id, year: ach.year },
      },
    });
  });

  // 3. Career Timeline Years (2004 - 2025)
  TIMELINE_YEAR_ITEMS.forEach((yearItem) => {
    const trophySummary = yearItem.trophiesWon.length > 0
      ? `Trophies: ${yearItem.trophiesWon.join(', ')}`
      : 'No official trophies';

    items.push({
      id: `timeline-year-${yearItem.year}`,
      category: 'year',
      categoryLabel: 'Year & Season',
      title: `${yearItem.year} — ${yearItem.milestoneTitle}`,
      subtitle: `${yearItem.club} (${yearItem.seasonLabel}) · ${yearItem.stats.goals} G, ${yearItem.stats.assists} A in ${yearItem.stats.apps} apps`,
      description: `${yearItem.shortSummary} ${yearItem.definingMoment} ${trophySummary}`,
      year: yearItem.year,
      badge: `${yearItem.stats.goals} GOALS`,
      teamOrContext: yearItem.club,
      tags: [
        yearItem.year.toString(),
        yearItem.seasonLabel,
        yearItem.club,
        yearItem.milestoneTitle,
        yearItem.eraBadge,
        ...yearItem.trophiesWon,
        'season',
        'year',
        'stats',
      ],
      action: {
        type: 'season',
        sectionId: 'career-timeline',
        payload: { year: yearItem.year, seasonLabel: yearItem.seasonLabel },
      },
    });
  });

  // 4. Detailed Season Stats (from SEASON_BY_SEASON_STATS)
  SEASON_BY_SEASON_STATS.forEach((season) => {
    const matchYear = season.season.split('/')[0] || '2004';
    const parsedYear = parseInt(matchYear, 10) || 2004;
    items.push({
      id: `season-stat-${season.season.replace('/', '-')}`,
      category: 'year',
      categoryLabel: 'Season Ledger',
      title: `${season.season} Season — ${season.club}`,
      subtitle: `${season.totalGoals} Goals · ${season.totalAssists} Assists in ${season.totalApps} Matches`,
      description: `League: ${season.leagueGoals}G/${season.leagueAssists}A, Continental: ${season.continentalGoals}G, Cup: ${season.cupGoals}G, International: ${season.intlGoals}G. Won: ${season.trophies.join(', ') || 'None'}.`,
      year: parsedYear,
      badge: `${season.totalGoals}G / ${season.totalAssists}A`,
      teamOrContext: season.club,
      tags: [
        season.season,
        season.club,
        ...season.trophies,
        parsedYear.toString(),
        'season stats',
        'goals',
        'assists',
      ],
      action: {
        type: 'season',
        sectionId: 'statistics',
        payload: { seasonQuery: season.season },
      },
    });
  });

  // 5. Biography Chapters (Biographical Milestones)
  BIOGRAPHY_CHAPTERS.forEach((chapter) => {
    items.push({
      id: `bio-chapter-${chapter.id}`,
      category: 'biography',
      categoryLabel: 'Biography Chapter',
      title: chapter.title,
      subtitle: `${chapter.eraRange} · ${chapter.location}`,
      description: `${chapter.tagline} ${chapter.keyThemes.join(' · ')} ${chapter.content[0] || ''}`,
      badge: chapter.eraRange,
      teamOrContext: chapter.location,
      tags: [
        chapter.title,
        chapter.eraRange,
        chapter.location,
        ...chapter.keyThemes,
        'biography',
        'life',
        'origin',
        'story',
        'napkin',
        'rosario',
        'youth',
      ],
      action: {
        type: 'chapter',
        sectionId: 'biography',
        payload: { chapterId: chapter.id, eraRange: chapter.eraRange },
      },
    });
  });

  // 6. Iconic Moments (Gallery & Narrative Highlights)
  ICONIC_MOMENTS.forEach((moment) => {
    items.push({
      id: `moment-${moment.id}`,
      category: 'milestone',
      categoryLabel: 'Historic Moment',
      title: moment.title,
      subtitle: `${moment.date} vs ${moment.opponent} · ${moment.competition}`,
      description: `${moment.subtitle} ${moment.description}`,
      year: moment.year,
      badge: moment.category.toUpperCase(),
      teamOrContext: moment.opponent,
      tags: [
        moment.title,
        moment.opponent,
        moment.competition,
        moment.year.toString(),
        moment.date,
        moment.venue,
        'iconic moment',
        'match',
        'gallery',
      ],
      action: {
        type: 'moment',
        sectionId: 'gallery',
        payload: { momentId: moment.id, moment },
      },
      originalMoment: moment,
    });
  });

  // 7. Tactical Iconic Goals (Pitch Visualizer Goals)
  ICONIC_GOALS_TACTICAL.forEach((goal) => {
    items.push({
      id: `tactical-goal-${goal.id}`,
      category: 'goal',
      categoryLabel: 'Iconic Goal',
      title: goal.title,
      subtitle: `${goal.date} vs ${goal.opponent} (${goal.minute}') · ${goal.type}`,
      description: `${goal.subtitle}. ${goal.context} ${goal.significance}`,
      year: parseInt(goal.date.slice(-4), 10) || undefined,
      badge: `${goal.distanceMeters}m · ${goal.type}`,
      teamOrContext: goal.competition,
      tags: [
        goal.title,
        goal.opponent,
        goal.competition,
        goal.type,
        goal.date,
        'goal',
        'tactical',
        'solo run',
        'free-kick',
        'header',
      ],
      action: {
        type: 'section',
        sectionId: 'pitch-visualizer',
        payload: { goalId: goal.id },
      },
    });
  });

  items.push({
    id: 'games-arcade',
    category: 'game',
    categoryLabel: 'Browser Games',
    title: 'Messi Arcade',
    subtitle: 'Six mini-games · Play in your browser',
    description: 'Penalty shootout, eight-question Messi trivia, Guess the Era clues, a reaction challenge, trophy memory matching, and career timeline ordering. Personal records stay in this browser.',
    badge: 'PLAY',
    tags: ['games', 'arcade', 'play', 'penalty shootout', 'quiz', 'trivia', 'guess the era', 'reaction challenge', 'trophy memory match', 'memory pairs', 'career timeline ordering', 'chronological order'],
    action: { type: 'section', sectionId: 'games' },
  });

  // Direct destinations complement (rather than replace) historical archive results.
  const sections = [
    ['hero', 'Home', 'Introduction to the Messi legacy archive', 'home welcome start'],
    ['news', 'Latest coverage', 'Publisher-linked Messi news and headlines', 'news latest coverage guardian'],
    ['achievement-timeline', 'Crown achievements', 'Major career records and achievements', 'achievements records milestones crown'],
    ['career-timeline', 'Career timeline', 'Explore career years, milestones and saved moments', 'timeline career seasons favourites favorites saved'],
    ['biography', 'Biography', 'The life and story of Lionel Messi', 'biography story life rosario'],
    ['statistics', 'Career statistics', 'Search season goals, assists and appearances', 'statistics stats goals assists seasons'],
    ['gallery', 'Photo gallery & iconic moments', 'Browse archive photographs, moments and saved photos', 'photos gallery pictures images favourites favorites saved'],
    ['lab', 'Interactive lab', 'Explore illustrated playbooks with playback controls', 'lab interactive tactics playbooks'],
    ['pitch-visualizer', 'Original goal simulator', 'Open the original tactical pitch visualizer', 'simulator original goal pitch visualizer'],
    ['games', 'Messi arcade', 'Six browser games and a daily challenge', 'games arcade play daily challenge'],
    ['trophies', 'Trophy cabinet', 'Explore honours, silverware and awards', 'trophies honours honors silverware awards cabinet'],
    ['trivia-quotes', 'Quotes, quiz & local polls', 'Original difficulty quiz, football quotes and the local goal vote', 'quotes quiz trivia polls vote fan challenge'],
  ];
  sections.forEach(([sectionId, title, description, keywords]) => items.push({
    id: `section-${sectionId}`, category: 'section', categoryLabel: 'Archive Section', title,
    subtitle: 'Jump to this section', description, badge: 'EXPLORE', tags: keywords.split(' '),
    action: { type: 'section', sectionId },
  }));
  const games = [
    ['penalty-game', 'Penalty shootout', 'Choose a direction in a five-shot round against a random keeper.', 'penalty shootout football goals shots'],
    ['arcade-trivia-game', 'Messi trivia', 'Answer eight source-linked historical questions.', 'trivia quiz questions knowledge'],
    ['era-game', 'Guess the era', 'Identify the club, country or career chapter from a clue.', 'guess era clues club country'],
    ['reaction-game', 'Reaction challenge', 'Wait for the signal, then tap or use the keyboard.', 'reaction challenge speed timing reflexes'],
    ['memory-game', 'Trophy memory match', 'Reveal cards and find matching trophy pairs.', 'trophy memory match matching pairs cards'],
    ['timeline-game', 'Career timeline challenge', 'Arrange career moments in chronological order using Up and Down.', 'career timeline ordering chronological order'],
    ['daily-challenge', 'Daily challenge', 'A sourced question selected for the date on your device.', 'daily challenge today question'],
  ];
  games.forEach(([focusId, title, description, keywords]) => items.push({
    id: `game-${focusId}`, category: 'game', categoryLabel: 'Browser Game', title,
    subtitle: 'Play in the Messi arcade', description, badge: 'PLAY', tags: keywords.split(' '),
    action: { type: 'section', sectionId: 'games', payload: { focusId } },
  }));

  return items;
}

// Cached index in memory
let cachedIndex: SearchIndexItem[] | null = null;

export function getSearchIndex(): SearchIndexItem[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

/**
 * Searches the archive with scoring, fuzzy token matching, and category filtering.
 */
export function searchArchive(
  query: string,
  categoryFilter: SearchCategory | 'all' = 'all',
  maxResults = 24
): SearchResult[] {
  const trimmed = query.trim();
  const normalizedQuery = normalizeSearchText(trimmed);

  const index = getSearchIndex();

  if (!normalizedQuery) {
    // If empty query, return top curated items optionally filtered by category
    const filtered = categoryFilter === 'all'
      ? index.filter((item) => item.category === 'trophy' || item.category === 'milestone')
      : index.filter((item) => item.category === categoryFilter);

    return filtered.slice(0, maxResults).map((item) => ({ item, score: 1 }));
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const isNumericQuery = /^\d{2,4}$/.test(normalizedQuery);
  const targetYear = isNumericQuery ? parseInt(normalizedQuery, 10) : null;

  const results: SearchResult[] = [];

  for (const item of index) {
    // Check category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      continue;
    }

    const normTitle = normalizeSearchText(item.title);
    const normSubtitle = normalizeSearchText(item.subtitle);
    const normDesc = normalizeSearchText(item.description);
    const normTags = item.tags.map(normalizeSearchText).join(' ');
    const normTeam = normalizeSearchText(item.teamOrContext || '');
    const combinedContent = `${normTitle} ${normSubtitle} ${normDesc} ${normTags} ${normTeam}`;

    // Verify all tokens match in combined content or year
    const allTokensMatch = queryTokens.every((token) => {
      if (item.year && item.year.toString().includes(token)) return true;
      if (item.yearsWon && item.yearsWon.some((y) => y.toString().includes(token))) return true;
      return combinedContent.includes(token);
    });

    if (!allTokensMatch) {
      continue;
    }

    // Calculate relevance score
    let score = 0;

    // Exact year match is high-value
    if (targetYear !== null) {
      if (item.year === targetYear) {
        score += 150;
      } else if (item.yearsWon && item.yearsWon.includes(targetYear)) {
        score += 130;
      } else if (item.year && item.year.toString().endsWith(normalizedQuery)) {
        score += 80;
      }
    }

    // Exact full query match in title
    if (normTitle === normalizedQuery) {
      score += 120;
    } else if (normTitle.startsWith(normalizedQuery)) {
      score += 90;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 70;
    }

    // Token occurrences in title
    for (const token of queryTokens) {
      if (normTitle.includes(token)) {
        score += 35;
      }
      if (normTags.includes(token)) {
        score += 25;
      }
      if (normSubtitle.includes(token)) {
        score += 20;
      }
      if (normDesc.includes(token)) {
        score += 10;
      }
    }

    // Boost major milestones and trophies slightly
    if (item.category === 'trophy' || item.category === 'milestone') {
      score += 15;
    }

    results.push({ item, score });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Text highlighting utility for splitting a string into matched/unmatched chunks safely.
 */
export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

export function splitTextForHighlight(text: string, query: string): HighlightSegment[] {
  if (!query || !query.trim() || !text) {
    return [{ text, isMatch: false }];
  }

  const tokens = query
    .trim()
    .split(/\s+/)
    .map((t) => normalizeSearchText(t))
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Escape regex special chars
  const escapedTokens = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Build case-insensitive regex
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');

  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isMatch: false,
      });
    }
    segments.push({
      text: match[0],
      isMatch: true,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMatch: false,
    });
  }

  return segments;
}

export const POPULAR_SEARCH_PROMPTS = [
  '2022 World Cup',
  '2012 (91 Goals)',
  "8x Ballon d'Or",
  'The Napkin Contract',
  '2009 Sextuple',
  'Getafe Solo Run',
  'Champions League 2011',
  'Inter Miami Leagues Cup',
];
