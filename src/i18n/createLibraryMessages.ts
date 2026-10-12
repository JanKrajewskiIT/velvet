import {
  type DictionaryNode,
  flatten,
  type I18nKey,
  lookup,
  type TranslateRichFn,
  type TranslateStaticFn,
  useI18n,
} from '@jankrajewskiit/i18n';

export type StaticTranslate = (key: I18nKey) => string;

export interface LibraryMessages {
  readonly staticTranslate: StaticTranslate;
  readonly useTranslate: () => TranslateStaticFn;
  readonly useTranslateRich: () => TranslateRichFn;
}

export const createLibraryMessages = (dictionary: DictionaryNode): LibraryMessages => {
  const defaults = flatten(dictionary);
  const fallbackFor = (key: I18nKey, translated: string): string | undefined =>
    translated === key ? (lookup(defaults, key) ?? key) : undefined;

  return {
    staticTranslate: (key) => lookup(defaults, key) ?? key,
    useTranslate: () => {
      const { t, ts } = useI18n();
      return (key, params) => {
        const translated = ts(key, params);
        const fallback = fallbackFor(key, translated);
        return fallback === undefined ? translated : t(fallback, params);
      };
    },
    useTranslateRich: () => {
      const { ts, tx } = useI18n();
      return (key, params) => {
        const fallback = fallbackFor(key, ts(key));
        // The rich renderer also accepts raw templates at runtime; its declared input is restricted to keys.
        return tx((fallback ?? key) as I18nKey, params);
      };
    },
  };
};
