import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { velvetEn } from '../en';
import { actionsPl } from './actions';
import { chartsPl } from './charts';
import { commonPl } from './common';
import { dataPl } from './data';
import { displayPl } from './display';
import { feedbackPl } from './feedback';
import { formsPl } from './forms';
import { layoutPl } from './layout';
import { mediaPl } from './media';
import { menusPl } from './menus';
import { navigationPl } from './navigation';
import { patternsPl } from './patterns';
import { primitivesPl } from './primitives';

export const velvetPl: TranslationOf<typeof velvetEn> = {
  velvet: {
    actions: actionsPl,
    charts: chartsPl,
    common: commonPl,
    data: dataPl,
    display: displayPl,
    feedback: feedbackPl,
    forms: formsPl,
    layout: layoutPl,
    media: mediaPl,
    menus: menusPl,
    navigation: navigationPl,
    patterns: patternsPl,
    primitives: primitivesPl,
  },
};
