import {
  type DictionaryNode,
  flatten,
  formatMessage,
  formatRichMessage,
  type I18nKey,
  lookup,
  type TranslateRichFn,
  type TranslateStaticFn,
  useI18n,
} from '@jankrajewskiit/i18n';
import type { JSX } from 'solid-js';

export type StaticTranslate = (key: I18nKey) => string;

export interface LibraryMessages {
  readonly staticTranslate: StaticTranslate;
  readonly useTranslate: () => TranslateStaticFn;
  readonly useTranslateRich: () => TranslateRichFn;
}

export const createLibraryMessages = (dictionary: DictionaryNode): LibraryMessages => {
  const defaults = flatten(dictionary);
  const fallbackFor = (key: I18nKey, translated: JSX.Element): string | undefined =>
    translated === key ? lookup(defaults, key) : undefined;

  return {
    staticTranslate: (key) => lookup(defaults, key) ?? key,
    useTranslate: () => {
      const { locale, ts } = useI18n();
      return (key, params) => {
        const translated = ts(key, params);
        const fallback = fallbackFor(key, translated);
        return fallback === undefined ? translated : formatMessage(fallback, locale(), params ?? {});
      };
    },
    useTranslateRich: () => {
      const { locale, tx } = useI18n();
      return (key, params) => {
        const translated = tx(key, params);
        const fallback = fallbackFor(key, translated);
        return fallback === undefined ? translated : formatRichMessage(fallback, locale(), params ?? {});
      };
    },
  };
};
