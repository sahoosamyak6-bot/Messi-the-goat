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
  'ronaldinho-piggyback': { photo: photoAssets.barcelona2007, contextLabel: 'Archive context: Barcelona at Levante in 2007, not Messi’s first goal in 2005.' },
  'ankara-messi': { photo: photoAssets.barcelona2007, contextLabel: 'Archive context: Barcelona at Levante in 2007, not the Getafe goal.' },
  'rome-header': { photo: photoAssets.barcelona2009, contextLabel: 'Archive context: a corner at Camp Nou in 2009, not the Rome final.' },
  'bernabeu-solo-2011': barcelona2011,
  'record-91-goals': { photo: photoAssets.barcelona2012, contextLabel: 'Archive context: Barcelona vs Bayer Leverkusen in 2012, not the record-breaking goal.' },
  'boateng-chip-neuer': barcelona2015,
  'bernabeu-shirt-500': { photo: photoAssets.barcelona2017, contextLabel: 'Archive context: Barcelona vs PSG in 2017, not the Bernabéu shirt celebration.' },
  'maracana-2021': argentina2022,
  'lusail-world-cup-2022': {
    photo: photoAssets.hero,
    contextLabel: 'Archive context: Messi at the 2022 World Cup, not the final or trophy ceremony.',
  },
  'miami-freekick-debut': {
    photo: photoAssets.miami2025,
    contextLabel: 'Archive context: Messi with Inter Miami against New York City FC in 2025, not his 2023 debut.',
  },
};

/** Context photography must not be presented as a photograph of the selected event. */
export const getMomentPhoto = (moment: Pick<IconicMoment, 'id'>): MomentPhoto =>
  momentPhotos[moment.id] ?? argentina2022;
