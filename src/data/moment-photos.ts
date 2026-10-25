import type { IconicMoment } from './messi-data';
import { photoAssets, type PhotoAsset } from './photo-assets';

export interface MomentPhoto {
  photo: PhotoAsset;
  contextLabel: string;
}

const barcelona2011: MomentPhoto = {
  photo: photoAssets.portrait,
  contextLabel: 'Archive context: Messi playing for Barcelona in 2011, not this specific moment.',
};

const barcelona2015: MomentPhoto = {
  photo: photoAssets.barcelona,
  contextLabel: 'Archive context: Barcelona vs Juventus, 2015 Champions League final, not this specific moment.',
};

const argentina2022: MomentPhoto = {
  photo: photoAssets.argentina,
  contextLabel: 'Archive context: Messi with Argentina at the 2022 World Cup, not this specific moment.',
};

const momentPhotos: Record<string, MomentPhoto> = {
  'ronaldinho-piggyback': barcelona2011,
  'ankara-messi': barcelona2011,
  'rome-header': barcelona2015,
  'bernabeu-solo-2011': barcelona2011,
  'record-91-goals': barcelona2011,
  'boateng-chip-neuer': barcelona2015,
  'bernabeu-shirt-500': barcelona2015,
  'maracana-2021': argentina2022,
  'lusail-world-cup-2022': {
    photo: photoAssets.hero,
    contextLabel: 'Archive context: Messi at the 2022 World Cup, not the final or trophy ceremony.',
  },
  'miami-freekick-debut': {
    photo: photoAssets.hero,
    contextLabel: 'Archive portrait: Messi with Argentina in 2022, not his Inter Miami debut.',
  },
};

/** Context photography must not be presented as a photograph of the selected event. */
export const getMomentPhoto = (moment: Pick<IconicMoment, 'id'>): MomentPhoto =>
  momentPhotos[moment.id] ?? argentina2022;
