import { createContext, createEffect, createMemo, createSignal, on, type ParentProps, useContext } from 'solid-js';

import { getVelvetRuntimeConfig } from '~/providers/velvet-config';

import {
  flattenI18nDictionary,
  getMessages,
  type I18nDictionary,
  type I18nMessageKey,
  type Locale,
  SUPPORTED_LOCALES,
} from './messages';

type FlatDictionary = Record<string, string>;

interface I18nContextValue {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  ts: (key: I18nMessageKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>();

const interpolate = (template: string, params?: Record<string, string | number>): string => {
  if (!params) return template;

  return template.replace(/\{\{\s*([^}]+?)\s*\}\}|\{\s*([^}]+?)\s*\}/gu, (_match, mustacheToken, braceToken) => {
    const token = (mustacheToken ?? braceToken) as string;
    const value = params[token];
    return value === undefined ? _match : String(value);
  });
};

const getStoredLocale = (storageKey: string): Locale => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(storageKey);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  const [browserLang] = navigator.language.split('-');
  if (browserLang && SUPPORTED_LOCALES.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return 'en';
};

interface I18nProviderProps extends ParentProps {
  storageKey?: string;
  initialLocale?: Locale;
  dictionaries?: Partial<Record<Locale, I18nDictionary>>;
}

const I18nProvider = (props: I18nProviderProps) => {
  const storageKey = () => props.storageKey ?? getVelvetRuntimeConfig().localeStorageKey;
  const [locale, setLocale] = createSignal<Locale>(props.initialLocale ?? getStoredLocale(storageKey()));

  const fallbackDictionary = createMemo<FlatDictionary>(() => ({
    ...getMessages('en'),
    ...flattenI18nDictionary(getVelvetRuntimeConfig().localeDictionaries.en),
    ...flattenI18nDictionary(props.dictionaries?.en),
  }));

  const dictionary = createMemo<FlatDictionary>(() => ({
    ...fallbackDictionary(),
    ...(locale() === 'en' ? {} : getMessages(locale())),
    ...flattenI18nDictionary(getVelvetRuntimeConfig().localeDictionaries[locale()]),
    ...flattenI18nDictionary(props.dictionaries?.[locale()]),
  }));

  createEffect(
    on(
      () => props.initialLocale,
      (nextLocale) => {
        if (!nextLocale) return;
        if (!SUPPORTED_LOCALES.includes(nextLocale)) return;
        if (locale() !== nextLocale) {
          setLocale(nextLocale);
        }
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      locale,
      (currentLocale) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey(), currentLocale);
        }
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('lang', currentLocale);
        }
      },
      { defer: true },
    ),
  );

  const t = (key: string, params?: Record<string, string | number>): string => {
    const template = dictionary()[key] || fallbackDictionary()[key] || key;
    return interpolate(template, params);
  };

  const ts = (key: I18nMessageKey, params?: Record<string, string | number>): string => t(key, params);

  return <I18nContext.Provider value={{ locale, setLocale, t, ts }}>{props.children}</I18nContext.Provider>;
};

export { I18nProvider };

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (context) return context;

  const fallbackLocale = (): Locale => 'en';
  const fallbackDictionary = getMessages('en');

  return {
    locale: fallbackLocale,
    setLocale: () => undefined,
    t: (key, params) => interpolate(fallbackDictionary[key] || key, params),
    ts: (key, params) => interpolate(fallbackDictionary[key] || key, params),
  };
};
