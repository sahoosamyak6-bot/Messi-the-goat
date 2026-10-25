/**
 * Real, openly licensed Messi photographs, downloaded from Wikimedia Commons.
 * Keep the credit, source and license links visible in the site’s photo credits.
 * Full source and adaptation details: /photos/CREDITS.md.
 */
export interface PhotoAsset {
  src: string;
  alt: string;
  credit: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  width: number;
  height: number;
  objectPosition: string;
  modifications: string;
}

export const photoAssets = {
  "hero": {
    "src": "/photos/messi-argentina-hero.webp",
    "alt": "Lionel Messi raising his fist in Argentina’s sky-blue and white shirt at the 2022 World Cup.",
    "credit": "Hossein Zohrevand / Tasnim News Agency",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel_Messi_WC2022.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "width": 720,
    "height": 744,
    "objectPosition": "50% 35%",
    "modifications": "Resized where needed and converted to WebP; layout may crop the displayed image."
  },
  "argentina": {
    "src": "/photos/messi-argentina-2022.webp",
    "alt": "Lionel Messi wearing Argentina’s number 10 shirt on the pitch at the 2022 World Cup.",
    "credit": "Hossein Zohrevand / Tasnim News Agency",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "width": 533,
    "height": 798,
    "objectPosition": "50% 32%",
    "modifications": "Resized where needed and converted to WebP; layout may crop the displayed image."
  },
  "barcelona": {
    "src": "/photos/messi-barcelona-final-2015.webp",
    "alt": "Lionel Messi in Barcelona’s red and blue shirt facing Patrice Evra in the 2015 Champions League final.",
    "credit": "Biser Todorov",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Moment_of_the_Champions_League_final_FC_Barcelona_-_Juventus_2015.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "width": 1280,
    "height": 942,
    "objectPosition": "40% 45%",
    "modifications": "Resized where needed and converted to WebP; layout may crop the displayed image."
  },
  "worldCup": {
    "src": "/photos/messi-argentina-celebration-2022.webp",
    "alt": "Lionel Messi and Argentina teammates celebrating during the 2022 World Cup match against Mexico.",
    "credit": "Hossein Zohrevand / Tasnim News Agency",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Argentina_vs_mexico_argentina_celebrando.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "width": 800,
    "height": 531,
    "objectPosition": "35% 50%",
    "modifications": "Resized where needed and converted to WebP; layout may crop the displayed image."
  },
  "portrait": {
    "src": "/photos/messi-barcelona-2011.webp",
    "alt": "Lionel Messi striking the ball in Barcelona’s red and blue striped shirt in 2011.",
    "credit": "Christopher Johnson; derivative by CHUCAO",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel_Messi,_Player_of_FC_Barcelona_team.JPG",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "width": 1100,
    "height": 1369,
    "objectPosition": "50% 35%",
    "modifications": "Resized where needed and converted to WebP; layout may crop the displayed image."
  },
  "barcelona2007": {
    "src": "/photos/messi-levante-2007.webp",
    "alt": "Lionel Messi shooting near the goal during Barcelona’s match against Levante in 2007.",
    "credit": "chantrybee; brightness adjustment by Till.niermann",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Messi_Gol_(Llevant_Barcelona_2007).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "width": 1280,
    "height": 853,
    "objectPosition": "50% 60%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "barcelona2009": {
    "src": "/photos/messi-camp-nou-2009.webp",
    "alt": "Lionel Messi taking a corner at Camp Nou during Barcelona’s match against Recreativo Huelva in 2009.",
    "credit": "Tsutomu Takasu",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel_Messi_of_FC_Barcelona,_April_11,_2009.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "width": 1200,
    "height": 800,
    "objectPosition": "45% 55%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "barcelona2012": {
    "src": "/photos/messi-leverkusen-2012.webp",
    "alt": "Lionel Messi in Barcelona’s striped shirt on the pitch against Bayer Leverkusen in 2012.",
    "credit": "Shai Pal",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:FC_Barcelona_-_Bayer_04_Leverkusen,_7_mar_2012_(48).jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "width": 1280,
    "height": 764,
    "objectPosition": "60% 45%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "argentina2014": {
    "src": "/photos/messi-world-cup-final-2014.webp",
    "alt": "Lionel Messi running with the ball in Argentina’s dark blue kit at the 2014 World Cup final.",
    "credit": "Jimmy Baikovicius",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Messi_flickr2014.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "width": 1280,
    "height": 853,
    "objectPosition": "50% 50%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "barcelona2017": {
    "src": "/photos/messi-barcelona-psg-2017.webp",
    "alt": "Lionel Messi seen from behind in Barcelona’s number 10 shirt during the 2017 Champions League match against Paris Saint-Germain.",
    "credit": "Hugo Pérez Marsol",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Barça_6_-_PSG_1;_Dimecres_8_de_març_de_2017_-_33299580926.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "width": 1280,
    "height": 1217,
    "objectPosition": "65% 45%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "psg2021": {
    "src": "/photos/messi-psg-marseille-2021.webp",
    "alt": "Lionel Messi wearing Paris Saint-Germain’s number 30 kit at the Stade Vélodrome in 2021.",
    "credit": "Bigmatbasket",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel_Messi_PSG.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "width": 776,
    "height": 1600,
    "objectPosition": "50% 25%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  },
  "miami2025": {
    "src": "/photos/messi-inter-miami-2025.webp",
    "alt": "Lionel Messi in Inter Miami’s black kit during the match against New York City FC in September 2025.",
    "credit": "Bryan Berlin",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lionel_Messi_NYCFC_Miami_24_Sep_2025-051.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "width": 1280,
    "height": 853,
    "objectPosition": "45% 35%",
    "modifications": "Resized and converted to WebP; layout may crop the displayed image. Derivatives retain the source image license."
  }
} satisfies Record<string, PhotoAsset>;

export const photoCredits: PhotoAsset[] = Object.values(photoAssets);

/** Smaller same-photo derivatives; widths match the generated WebP files. */
export const photoWidths = (photo: PhotoAsset): number[] =>
  [320, 480, 768].filter(width => width < photo.width).concat(photo.width);

export const photoSrcSet = (photo: PhotoAsset): string =>
  photoWidths(photo).map(width => `${width === photo.width ? photo.src : photo.src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`).join(', ');
