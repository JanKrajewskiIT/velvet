import './augment';

import { velvetEn } from './en';
import { velvetPl } from './pl';

/** Library dictionaries per locale; compose them with the app's own in `defineDictionaries`. */
export const velvetMessages = { en: velvetEn, pl: velvetPl } as const;
