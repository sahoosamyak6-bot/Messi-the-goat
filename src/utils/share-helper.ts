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
    badge: 'Independent Fan Archive',
    description: 'Explore Lionel Messi’s story through career milestones, archive photographs, historical statistics, and interactive playbooks.',
    highlightStat: 'Career Stories · Archive Moments · Interactive Playbooks',
    hashtags: ['LionelMessi', 'GOAT', 'MessiArchive', 'FootballHistory'],
  },
  news: {
    sectionId: 'news',
    sectionLabel: 'Latest Coverage',
    previewTitle: 'Latest Messi Coverage | The Lionel Messi Archive',
    badge: 'Credited Publisher Coverage',
    description: 'Browse recent Messi headlines from The Guardian, with source links and publication dates. Coverage refreshes separately from the historical archive.',
    highlightStat: 'Publisher Headlines · Source Links · Publication Dates',
    hashtags: ['LionelMessi', 'FootballNews', 'MessiArchive'],
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
    badge: 'Historical Timeline · 2004–2025',
    description: 'Explore the original archive’s historical season-by-season snapshot across FC Barcelona, Paris Saint-Germain, Inter Miami, and Argentina.',
    highlightStat: 'Historical Snapshot · Club & Country',
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
    previewTitle: 'Historical Career Statistics | Lionel Messi Archive',
    badge: 'Historical Statistics Snapshot',
    description: 'Explore season-by-season match, goal, and assist totals preserved from the original project. These archive figures are historical snapshots, not live career totals.',
    highlightStat: 'Historical Snapshot: 1,080+ Matches · 849+ Goals · 378+ Assists',
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
  lab: {
    sectionId: 'lab',
    sectionLabel: 'The Messi Lab',
    previewTitle: 'Genius, in Motion | The Interactive Messi Lab',
    badge: 'Illustrative Playbooks',
    description: 'Play, pause, scrub, and step through three historical plays using illustrative movement paths. These tactical diagrams are not measured player-tracking data.',
    highlightStat: 'Three Playbooks · Step-by-Step Replay · Playback Controls',
    hashtags: ['MessiLab', 'FootballTactics', 'LionelMessi'],
  },
  'pitch-visualizer': {
    sectionId: 'pitch-visualizer',
    sectionLabel: 'Pitch Visualizer & Goal Lab',
    previewTitle: 'Interactive Tactical Pitch Visualizer | Lionel Messi Goal Lab',
    badge: 'Tactical Geometry',
    description: 'Explore the original Goal Lab’s animated dribble paths and strike trajectories. This interactive simulator is illustrative, not measured match tracking.',
    highlightStat: 'Illustrative Trajectories & Strike Geometry',
    hashtags: ['GoalLab', 'FootballTactics', 'PitchVisualizer', 'MessiGoals'],
  },
  games: {
    sectionId: 'games',
    sectionLabel: 'Messi Arcade',
    previewTitle: 'Your Turn, Number Ten | Messi Arcade',
    badge: 'Six Browser Mini-Games',
    description: 'Take a five-shot penalty round, test your Messi trivia, guess the era, challenge your reaction time, match trophy pairs, and order career milestones. Personal records stay in this browser, not on a public leaderboard.',
    highlightStat: 'Penalties · Trivia · Eras · Reactions · Trophy Memory · Career Timeline',
    hashtags: ['MessiArcade', 'FootballGames', 'LionelMessi'],
  },
  trophies: {
    sectionId: 'trophies',
    sectionLabel: 'The Golden Trophy Cabinet',
    previewTitle: 'The Golden Cabinet: Historical Trophy Archive | Lionel Messi',
    badge: 'Historical Trophy Snapshot',
    description: 'Explore the original archive’s trophy collection, including La Liga, Champions League, and World Cup honors. Totals are historical snapshots, not a live tally.',
    highlightStat: 'Historical Snapshot: 46 Major Honors',
    hashtags: ['TrophyCabinet', 'MessiArchive', 'WorldChampion', 'GOAT'],
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
  'news',
  'achievement-timeline',
  'career-timeline',
  'biography',
  'statistics',
  'gallery',
  'lab',
  'pitch-visualizer',
  'games',
  'trophies',
  'trivia-quotes',
];

/**
 * Returns metadata for a section ID with safe fallback to hero
 */
export function getSectionShareMetadata(sectionId?: string): SectionShareMetadata {
  if (!sectionId || !Object.hasOwn(SHAREABLE_SECTIONS, sectionId)) return SHAREABLE_SECTIONS.hero;
  return SHAREABLE_SECTIONS[sectionId];
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
  const safeId = getSectionShareMetadata(sectionId).sectionId;
  let origin = baseUrl;

  if (!origin) {
    if (typeof window !== 'undefined' && window.location) {
      origin = `${window.location.origin}${window.location.pathname}`;
    } else {
      origin = 'https://messi-the-goat.vercel.app/';
    }
  }

  // Keep nested deployment paths and query parameters intact; replace only the fragment.
  const url = new URL(origin, 'https://messi-the-goat.vercel.app/');
  url.hash = safeId;
  return url.href;
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

export interface ClipboardOptions {
  signal?: AbortSignal;
  /** Keep the legacy selection inside a native modal, where the background is inert. */
  container?: HTMLElement;
}

/** Call only from an explicit copy gesture. Aborting prevents further attempts and stale feedback. */
export async function copyTextToClipboard(text: string, options: ClipboardOptions = {}): Promise<boolean> {
  const { signal, container } = options;
  if (typeof window === 'undefined' || typeof document === 'undefined' || signal?.aborted) return false;

  // Run the synchronous fallback first, while the original user activation is still available.
  let textArea: HTMLTextAreaElement | null = null;
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = window.getSelection?.() ?? null;
  const previousRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const previousInputSelection = previousFocus instanceof HTMLInputElement || previousFocus instanceof HTMLTextAreaElement
    ? { start: previousFocus.selectionStart, end: previousFocus.selectionEnd, direction: previousFocus.selectionDirection }
    : null;

  try {
    textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.readOnly = true;
    textArea.tabIndex = -1;
    textArea.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;font-size:16px;';
    const parent = container ?? document.querySelector('dialog[open]') ?? document.body;
    parent.appendChild(textArea);
    textArea.focus({ preventScroll: true });
    textArea.select();
    if (document.execCommand('copy')) return true;
  } catch {
    // A missing or rejected legacy API may still allow the modern Clipboard API.
  } finally {
    textArea?.remove();
    // Restoration is best-effort: detached ranges or an unavailable focus target must not
    // turn an otherwise successful copy into a rejected promise or skip the next API.
    try { if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); } catch { /* Target changed. */ }
    try {
      if (selection) {
        selection.removeAllRanges();
        for (const range of previousRanges) selection.addRange(range);
      }
    } catch { /* The original selection may have been detached. */ }
    try {
      if (previousFocus?.isConnected && previousInputSelection?.start != null && previousInputSelection.end != null) {
        (previousFocus as HTMLInputElement | HTMLTextAreaElement).setSelectionRange(
          previousInputSelection.start, previousInputSelection.end, previousInputSelection.direction ?? undefined,
        );
      }
    } catch { /* Input type or selection support changed. */ }
  }

  if (signal?.aborted) return false;
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      // Browsers cannot cancel an already-started native write, but its result must not update a closed dialog.
      return !signal?.aborted;
    }
  } catch {
    // Neither API succeeded. Never report a successful copy in this case.
  }
  return false;
}
