export interface HighlightVideo {
  videoId: string;
  title: string;
  publisher: string;
  format: 'Goal replay' | 'Match highlights' | 'Goal retrospective' | 'Full match archive';
  context: string;
  verifiedOn: string;
}

// Official club, competition, league, or broadcaster uploads. Each returned
// public YouTube oEmbed metadata and embed HTML on the verification date.
// Availability remains subject to the publisher's regional and playback rules.
export const HIGHLIGHT_VIDEOS: Readonly<Record<string, HighlightVideo>> = {
  'ronaldinho-piggyback': {
    videoId: 'YuoN3EYdNTs',
    title: 'FULL MATCH: THE DAY MESSI SCORED HIS FIRST GOAL (BARÇA-ALBACETE 2005)',
    publisher: 'FC Barcelona',
    format: 'Full match archive',
    context: 'The complete 2005 Albacete match, not a short goal clip. Messi’s first senior goal comes near the end.',
    verifiedOn: '2026-10-25',
  },
  'ankara-messi': {
    videoId: 'gwoKBi3FHvo',
    title: 'How Messi explained his incredible goal against Getafe',
    publisher: 'FC Barcelona',
    format: 'Goal retrospective',
    context: 'An official retrospective on the Getafe solo goal, rather than an isolated replay.',
    verifiedOn: '2026-10-25',
  },
  'rome-header': {
    videoId: 'crOBBouZbmc',
    title: '50 Great Champions League Moments: Lionel Messi’s Header vs. Manchester United | 2009 UCL Final',
    publisher: 'CBS Sports Golazo',
    format: 'Goal replay',
    context: 'The header against Manchester United in the 2009 Champions League final, from the official broadcaster’s archive.',
    verifiedOn: '2026-10-25',
  },
  'boateng-chip-neuer': {
    videoId: 'WSD--66JHkI',
    title: 'Messi scores after leaving Boateng on the floor! | UCL Goal of the Season 2014/15',
    publisher: 'FC Barcelona',
    format: 'Goal replay',
    context: 'Messi’s second goal against Bayern Munich in the 2015 Champions League semi-final first leg.',
    verifiedOn: '2026-10-25',
  },
  'lusail-world-cup-2022': {
    videoId: 'IipmpVcISXE',
    title: 'Argentina v France: 2022 #FIFAWorldCup Final Highlights',
    publisher: 'FIFA',
    format: 'Match highlights',
    context: 'Official highlights of the Argentina–France final. This is a match recap, not a dedicated trophy-lift clip.',
    verifiedOn: '2026-10-25',
  },
  'miami-freekick-debut': {
    videoId: 'K6fltq0dn_E',
    title: 'Lionel Messi GOLAZO wins it in STOPPAGE TIME on Inter Miami debut!',
    publisher: 'Major League Soccer',
    format: 'Goal replay',
    context: 'The stoppage-time free-kick winner against Cruz Azul on Messi’s Inter Miami debut.',
    verifiedOn: '2026-10-25',
  },
};

export function getHighlightVideo(momentId: string): HighlightVideo | undefined {
  return Object.hasOwn(HIGHLIGHT_VIDEOS, momentId) ? HIGHLIGHT_VIDEOS[momentId] : undefined;
}

function validateVideoId(videoId: string): void {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error('Invalid YouTube video ID');
}

export function getHighlightEmbedUrl(videoId: string): string {
  validateVideoId(videoId);
  // No autoplay and no third-party request until the visitor loads the player.
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&playsinline=1&rel=0`;
}

export function getHighlightSourceUrl(videoId: string): string {
  validateVideoId(videoId);
  return `https://www.youtube.com/watch?v=${videoId}`;
}
