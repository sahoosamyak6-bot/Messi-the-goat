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
  }
} satisfies Record<string, PhotoAsset>;

export const photoCredits: PhotoAsset[] = Object.values(photoAssets);
