import './builtin';

import { createContext, createEffect, createMemo, createSignal, on, type ParentProps, useContext } from 'solid-js';

import { getVelvetRuntimeConfig } from '~/providers/velvet-config';

import {
  type FlatI18nDictionary,
  getRegisteredMessages,
  hasRegisteredMessage,
  type I18nMessageKey,
  type Locale,
  SUPPORTED_LOCALES,
} from './registry';

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

interface ImportMetaEnvLike {
  DEV?: boolean;
  MODE?: string;
}

const isDev = (): boolean => {
  const env = (import.meta as { env?: ImportMetaEnvLike }).env;
  if (!env) return false;
  if (env.DEV !== undefined) return env.DEV;
  if (env.MODE !== undefined) return env.MODE !== 'production';
  return false;
};

const warnedKeys = new Set<string>();
const warnFallback = (locale: Locale, key: string): void => {
  if (!isDev()) return;
  const sigil = `${locale}:${key}`;
  if (warnedKeys.has(sigil)) return;
  warnedKeys.add(sigil);
  // eslint-disable-next-line no-console
  console.warn(`[velvet-ui i18n] Missing "${key}" for locale "${locale}". Falling back to "en".`);
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
}

const I18nProvider = (props: I18nProviderProps) => {
  const storageKey = () => props.storageKey ?? getVelvetRuntimeConfig().localeStorageKey;
  const [locale, setLocale] = createSignal<Locale>(props.initialLocale ?? getStoredLocale(storageKey()));

  const fallbackDictionary = createMemo<FlatI18nDictionary>(() => getRegisteredMessages('en'));

  const dictionary = createMemo<FlatI18nDictionary>(() => {
    if (locale() === 'en') return fallbackDictionary();
    return { ...fallbackDictionary(), ...getRegisteredMessages(locale()) };
  });

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

  const resolveTemplate = (key: string): string => {
    const current = dictionary()[key];
    if (current !== undefined) return current;
    const fallback = fallbackDictionary()[key];
    if (fallback !== undefined) {
      if (locale() !== 'en' && !hasRegisteredMessage(locale(), key)) {
        warnFallback(locale(), key);
      }
      return fallback;
    }
    return key;
  };

  const t = (key: string, params?: Record<string, string | number>): string =>
    interpolate(resolveTemplate(key), params);

  const ts = (key: I18nMessageKey, params?: Record<string, string | number>): string => t(key, params);

  return <I18nContext.Provider value={{ locale, setLocale, t, ts }}>{props.children}</I18nContext.Provider>;
};

export { I18nProvider };

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (context) return context;

  const fallbackLocale = (): Locale => 'en';

  return {
    locale: fallbackLocale,
    setLocale: () => undefined,
    t: (key, params) => interpolate(getRegisteredMessages('en')[key] ?? key, params),
    ts: (key, params) => interpolate(getRegisteredMessages('en')[key] ?? key, params),
  };
};
