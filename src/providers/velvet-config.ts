import type { OidcAuthConfig } from '@jankrajewskiit/auth';

import type { ComposedDictionaries } from '~/i18n';
import type { Locale } from '~/i18n';

interface VelvetConfigInput {
  authConfig?: OidcAuthConfig;
  initialLocale?: Locale;
  dictionaries?: ComposedDictionaries;
}

const VELVET_THEME_STORAGE_KEY = 'velvet-theme';
const VELVET_LOCALE_STORAGE_KEY = 'velvet-locale';

export type { VelvetConfigInput };
export { VELVET_LOCALE_STORAGE_KEY, VELVET_THEME_STORAGE_KEY };
