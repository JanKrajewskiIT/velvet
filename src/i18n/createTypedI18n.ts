import { useI18n as useBaseI18n } from '~/i18n/I18nProvider';
import type { Locale } from '~/i18n/messages';

type DictionaryKeyOf<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${DictionaryKeyOf<T[K]>}`
      : never;
}[keyof T & string];

interface TypedI18nContextValue<TKey extends string> {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TKey, params?: Record<string, string | number>) => string;
  ts: (key: TKey, params?: Record<string, string | number>) => string;
}

function createTypedI18n<TDictionary extends Record<string, unknown>>() {
  type DictKey = DictionaryKeyOf<TDictionary>;

  return function useTypedI18n(): TypedI18nContextValue<DictKey> {
    const { t, ...rest } = useBaseI18n();
    const translate = (key: DictKey, params?: Record<string, string | number>) => t(key, params);

    return {
      ...rest,
      t: translate,
      ts: translate,
    };
  };
}

export type { DictionaryKeyOf, TypedI18nContextValue };
export { createTypedI18n };
