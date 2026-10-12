import type { StaticTranslate } from '../../i18n/createLibraryMessages';
import { uiMessages } from '../../i18n/useTranslate';

export type { StaticTranslate } from '../../i18n/createLibraryMessages';

/** Bundled English text for exported constants that are built outside a component; only for messages without parameters. */
export const englishText: StaticTranslate = uiMessages.staticTranslate;
