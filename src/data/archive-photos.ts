import { photoAssets, type PhotoAsset } from './photo-assets';

export interface ArchivePhoto { id: string; photo: PhotoAsset; year: number; caption: string; team: string; }

/** Source-verified photographs; captions describe the actual frame, not a different milestone. */
export const archivePhotos: ArchivePhoto[] = [
  { id: "barcelona2007", photo: photoAssets.barcelona2007, year: 2007, caption: "Barcelona at Levante · 2007", team: "FC Barcelona" },
  { id: "barcelona2009", photo: photoAssets.barcelona2009, year: 2009, caption: "A corner at Camp Nou · 2009", team: "FC Barcelona" },
  { id: "barcelona2012", photo: photoAssets.barcelona2012, year: 2012, caption: "Barcelona vs Bayer Leverkusen · 2012", team: "FC Barcelona" },
  { id: "argentina2014", photo: photoAssets.argentina2014, year: 2014, caption: "Argentina at the World Cup final · 2014", team: "Argentina" },
  { id: "barcelona2017", photo: photoAssets.barcelona2017, year: 2017, caption: "Barcelona’s comeback night against PSG · 2017", team: "FC Barcelona" },
  { id: "psg2021", photo: photoAssets.psg2021, year: 2021, caption: "Paris Saint-Germain at Marseille · 2021", team: "Paris Saint-Germain" },
  { id: "miami2025", photo: photoAssets.miami2025, year: 2025, caption: "Inter Miami vs New York City FC · 2025", team: "Inter Miami CF" },
];

/** Closest photographed year for the same club, explicitly labeled as contextual imagery. */
export function getCareerPhoto(year: number, club: string): ArchivePhoto | undefined {
  return archivePhotos.filter(item => item.team === club)
    .reduce<ArchivePhoto | undefined>((closest, item) => !closest || Math.abs(item.year - year) < Math.abs(closest.year - year) ? item : closest, undefined);
}
