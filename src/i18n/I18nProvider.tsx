import { createContext, createEffect, createMemo, createSignal, type ParentProps, useContext } from 'solid-js';

import { getMessages, type I18nMessageKey, type Locale, SUPPORTED_LOCALES } from './messages';

interface I18nContextValue {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  t: (key: I18nMessageKey, params?: Record<string, string | number>) => string;
}

const DEFAULT_STORAGE_KEY = 'velvet-locale';

const I18nContext = createContext<I18nContextValue>();

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;

  return template.replace(/\{([^}]+)\}/gu, (_m, token: string) => {
    const value = params[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}

function getStoredLocale(storageKey: string): Locale {
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
}

interface I18nProviderProps extends ParentProps {
  storageKey?: string;
  initialLocale?: Locale;
}

const I18nProvider = (props: I18nProviderProps) => {
  const storageKey = () => props.storageKey ?? DEFAULT_STORAGE_KEY;
  const [locale, setLocale] = createSignal<Locale>(props.initialLocale ?? getStoredLocale(storageKey()));
  const dictionary = createMemo(() => getMessages(locale()));

  createEffect(() => {
    const nextLocale = props.initialLocale;
    if (!nextLocale) return;
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return;
    if (locale() !== nextLocale) {
      setLocale(nextLocale);
    }
  });

  createEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey(), locale());
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale());
    }
  });

  const t = (key: I18nMessageKey, params?: Record<string, string | number>): string => {
    const template = dictionary()[key] || getMessages('en')[key] || key;
    return interpolate(template, params);
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{props.children}</I18nContext.Provider>;
};

export { I18nProvider };

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (context) return context;

  const fallbackLocale = (): Locale => 'en';
  return {
    locale: fallbackLocale,
    setLocale: () => undefined,
    t: (key, params) => interpolate(getMessages('en')[key] || key, params),
  };
}
