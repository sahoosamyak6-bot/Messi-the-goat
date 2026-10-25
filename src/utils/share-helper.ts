/**
 * Pure helper functions for section deep linking, metadata preview titles,
 * and social media post snippet generation.
 */

export interface SectionShareMetadata {
  sectionId: string;
  sectionLabel: string;
  previewTitle: string;
  badge: string;
  description: string;
  highlightStat: string;
  hashtags: string[];
}

export const SHAREABLE_SECTIONS: Record<string, SectionShareMetadata> = {
  hero: {
    sectionId: 'hero',
    sectionLabel: 'The Definitive Archive',
    previewTitle: 'Lionel Andrés Messi | The Definitive Archive & Chronicle',
    badge: 'Overview · 1987–Present',
    description: 'Explore the complete legacy of football’s greatest player: 849+ career goals, 378+ assists, 46 official trophies, and 8 Ballon d’Or awards.',
    highlightStat: '46 Trophies · 8 Ballon d’Ors · 849+ Goals',
    hashtags: ['LionelMessi', 'GOAT', 'MessiArchive', 'FootballHistory'],
  },
  'achievement-timeline': {
    sectionId: 'achievement-timeline',
    sectionLabel: '6 Crown Achievements',
    previewTitle: 'The 6 Crown Achievements | Lionel Messi’s Historic Milestones',
    badge: 'Crown Milestones',
    description: 'From the 2022 World Cup coronation in Lusail to 91 goals in 2012 and 8 Ballon d’Ors — the definitive timeline of crowning career feats.',
    highlightStat: 'World Cup 2022 · 91 Goals in 2012 · 8x Ballon d’Or',
    hashtags: ['LionelMessi', 'WorldCup2022', 'BallonDor', 'CrownAchievements'],
  },
  'career-timeline': {
    sectionId: 'career-timeline',
    sectionLabel: 'Career Timeline',
    previewTitle: 'Interactive Career Timeline (2004–2025) | Lionel Messi',
    badge: '21 Professional Seasons',
    description: 'Explore 21 historic seasons year-by-year across FC Barcelona, Paris Saint-Germain, Inter Miami, and Argentina national team silverware.',
    highlightStat: '21 Seasons · 4 Iconic Eras · 3 Historic Clubs',
    hashtags: ['MessiTimeline', 'FCBarcelona', 'Argentina', 'InterMiami'],
  },
  biography: {
    sectionId: 'biography',
    sectionLabel: 'The Legend’s Odyssey',
    previewTitle: 'The Legend’s Odyssey: Chapter Biography | Lionel Messi',
    badge: 'Biographical Chronicles',
    description: 'From childhood growth hormone battles in Rosario to youth academy miracles at La Masia and the immortal Albiceleste World Cup glory.',
    highlightStat: 'Rosario Childhood to World Champion',
    hashtags: ['LionelMessi', 'LaMasia', 'Rosario', 'Albiceleste'],
  },
  statistics: {
    sectionId: 'statistics',
    sectionLabel: 'Career Statistics',
    previewTitle: 'Career Statistics & All-Time Records | Lionel Messi Archive',
    badge: 'Official Match Records',
    description: 'Season-by-season match logs, goal tallies, playmaker assists, per-game averages, and breakdown across all domestic & international competitions.',
    highlightStat: '1,080+ Matches · 849+ Goals · 378+ Assists',
    hashtags: ['MessiStats', 'Playmaker', 'GoalScorer', 'FootballRecords'],
  },
  gallery: {
    sectionId: 'gallery',
    sectionLabel: 'Iconic Moments Gallery',
    previewTitle: 'Iconic Moments & Masterclasses Gallery | Lionel Messi',
    badge: 'Cinematic Moments',
    description: 'Immortal celebrations, solo runs against Getafe, Bernabéu jersey lift, Copa América 2021 triumph, and Lusail coronation.',
    highlightStat: 'Getafe Solo Run · Bernabéu 500th · Lusail Lift',
    hashtags: ['IconicMoments', 'ElClasico', 'Lusail2022', 'MessiMagic'],
  },
  'pitch-visualizer': {
    sectionId: 'pitch-visualizer',
    sectionLabel: 'Pitch Visualizer & Goal Lab',
    previewTitle: 'Interactive Tactical Pitch Visualizer | Lionel Messi Goal Lab',
    badge: 'Tactical Geometry',
    description: 'Step into the Goal Lab: analyze pitch coordinates, dribble paths, defender displacements, and strike trajectories of Messi’s greatest goals.',
    highlightStat: 'Animated Trajectories & Strike Geometry',
    hashtags: ['GoalLab', 'FootballTactics', 'PitchVisualizer', 'MessiGoals'],
  },
  trophies: {
    sectionId: 'trophies',
    sectionLabel: 'The Golden Trophy Cabinet',
    previewTitle: 'The Golden Cabinet: 46 Official Titles | Lionel Messi',
    badge: 'All-Time Record Silverware',
    description: 'Inspect the most decorated silverware collection in association football history: 46 official trophies, 10 La Ligas, 4 Champions Leagues, and the World Cup.',
    highlightStat: '46 Major Honors · Most Decorated in History',
    hashtags: ['TrophyCabinet', '46Titles', 'WorldChampion', 'GOAT'],
  },
  'trivia-quotes': {
    sectionId: 'trivia-quotes',
    sectionLabel: 'Quotes & GOAT Trivia',
    previewTitle: 'Pantheon Quotes & Interactive GOAT Quiz | Lionel Messi Archive',
    badge: 'The Pantheon & Trivia',
    description: 'How Guardiola, Pelé, and Maradona comprehended the maestro, paired with an interactive 10-question GOAT trivia challenge.',
    highlightStat: 'Voices of Legends & Interactive Quiz',
    hashtags: ['MessiQuiz', 'FootballQuotes', 'Pantheon', 'MessiTrivia'],
  },
};

/**
 * Section order for selectors and sharing
 */
export const SECTION_ORDER: string[] = [
  'hero',
  'achievement-timeline',
  'career-timeline',
  'biography',
  'statistics',
  'gallery',
  'pitch-visualizer',
  'trophies',
  'trivia-quotes',
];

/**
 * Returns metadata for a section ID with safe fallback to hero
 */
export function getSectionShareMetadata(sectionId?: string): SectionShareMetadata {
  if (!sectionId) return SHAREABLE_SECTIONS.hero;
  return SHAREABLE_SECTIONS[sectionId] || SHAREABLE_SECTIONS.hero;
}

/**
 * Returns all shareable section metadata in visual order
 */
export function getAllShareableSections(): SectionShareMetadata[] {
  return SECTION_ORDER.map((id) => SHAREABLE_SECTIONS[id]);
}

/**
 * Formats a section direct deep-link URL
 */
export function buildSectionDirectUrl(sectionId?: string, baseUrl?: string): string {
  const safeId = sectionId || 'hero';
  let origin = baseUrl;

  if (!origin) {
    if (typeof window !== 'undefined' && window.location) {
      origin = `${window.location.origin}${window.location.pathname}`;
    } else {
      origin = 'https://lionel-messi-archive.web.app/';
    }
  }

  // Remove existing hash or trailing slashes before appending anchor
  const cleanedUrl = origin.split('#')[0].replace(/\/+$/, '');
  return `${cleanedUrl}/#${safeId}`;
}

export interface PostSnippetOptions {
  sectionId?: string;
  baseUrl?: string;
  style?: 'detailed' | 'compact' | 'quote';
}

/**
 * Generates an engaging, platform-ready social post snippet
 */
export function generateSocialPostSnippet(options: PostSnippetOptions = {}): string {
  const { sectionId, baseUrl, style = 'detailed' } = options;
  const meta = getSectionShareMetadata(sectionId);
  const url = buildSectionDirectUrl(meta.sectionId, baseUrl);
  const tagString = meta.hashtags.map((tag) => `#${tag}`).join(' ');

  if (style === 'compact') {
    return `🐐 ${meta.previewTitle}\n${meta.highlightStat}\n\n👉 ${url}\n\n${tagString}`;
  }

  if (style === 'quote') {
    return `👑 "${meta.previewTitle}"\n\n${meta.description}\n\n📖 Explore this section: ${url}\n\n${tagString}`;
  }

  // Detailed standard style
  return `👑 ${meta.previewTitle}\n${meta.description}\n\n✨ Key Highlights: ${meta.highlightStat}\n🔗 Explore section: ${url}\n\n${tagString}`;
}

export interface SocialIntentUrls {
  twitter: string;
  whatsapp: string;
  telegram: string;
  linkedin: string;
  facebook: string;
  email: string;
}

/**
 * Builds direct Web Intent URLs for 1-click sharing to social platforms
 */
export function generateSocialIntentUrls(options: PostSnippetOptions = {}): SocialIntentUrls {
  const meta = getSectionShareMetadata(options.sectionId);
  const url = buildSectionDirectUrl(meta.sectionId, options.baseUrl);
  const text = `🐐 ${meta.previewTitle}\n${meta.description}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedFullSnippet = encodeURIComponent(generateSocialPostSnippet(options));
  const encodedTitle = encodeURIComponent(meta.previewTitle);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodeURIComponent(meta.hashtags.join(','))}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedFullSnippet}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedFullSnippet}`,
  };
}

/**
 * Copies text to the system clipboard with robust fallback preserving user gesture
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Try synchronous textarea execCommand first to guarantee active user gesture activation
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch {
    // Continue to Clipboard API fallback
  }

  // 2. Try modern Clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Both approaches failed
    }
  }

  return true;
}
