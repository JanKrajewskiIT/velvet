import { useI18n } from '@jankrajewskiit/ui';
import { createMemo } from 'solid-js';

import type { DemoI18nMessageKey } from '../i18n/messages';
import { getDemoMessages } from '../i18n/messages';
import { interpolateText } from '../i18n/renderRichText';

export const useDemoDictionary = () => {
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey, params?: Record<string, string | number>): string =>
    interpolateText(dictionary()[key], params);

  return { dictionary, locale, t };
};
