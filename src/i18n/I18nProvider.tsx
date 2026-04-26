/**
 * VelvetUi i18n provider.
 *
 * Reactive Solid context exposing:
 *   - `locale()` / `setLocale(...)` signals
 *   - `t(key, params?)` – type-safe message translation
 *   - `formatNumber(value, options?)` – locale-aware number
 *   - `formatDate(value, options?)` – locale-aware date/time
 *   - `formatRelativeTime(value, unit, options?)` – locale-aware relative time
 *
 * Dictionaries are passed in declaratively (via `<VelvetProvider dictionaries={...}>`
 * or directly as a prop on `<I18nProvider>`); there is no global registry
 * and no side-effectful registration.
 */

import {
  type Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  type ParentProps,
  useContext,
} from 'solid-js';

import { getVelvetRuntimeConfig } from '~/providers/velvet-config';

import { en as builtinEn, pl as builtinPl } from './builtin';
import { type ComposedDictionaries, defineDictionaries } from './defineDictionary';
import { compileMessage } from './format/compiler';
import { getDateTimeFormat, getNumberFormat, getRelativeTimeFormat } from './format/intl';
import { type FlatDictionary, type Locale, type MessageParams, SUPPORTED_LOCALES, type VelvetI18nKey } from './types';

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
const warnMissing = (locale: Locale, key: string, fallbackUsed: boolean): void => {
  if (!isDev()) return;
  const sigil = `${locale}:${key}:${fallbackUsed ? 'fb' : 'miss'}`;
  if (warnedKeys.has(sigil)) return;
  warnedKeys.add(sigil);
  // eslint-disable-next-line no-console
  console.warn(
    fallbackUsed
      ? `[velvet-ui i18n] Missing key "${key}" for locale "${locale}". Falling back to "en".`
      : `[velvet-ui i18n] Missing key "${key}" in every locale. Returning the key verbatim.`,
  );
};

const detectInitialLocale = (storageKey: string): Locale => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(storageKey);
  if (stored && (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(stored)) {
    return stored as Locale;
  }
  const browser = window.navigator.language.split('-')[0];
  if (browser && (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(browser)) {
    return browser as Locale;
  }
  return 'en';
};

/**
 * Type-safe translation function.
 *
 * The key parameter accepts:
 *   - any path proven to exist in the augmented `VelvetI18nDictionary`
 *     (autocomplete, rename and find-references all work), and
 *   - any string literal (with `(string & {})`), so dynamic keys still type-check
 *     and the developer is responsible for runtime correctness.
 */
export type TranslateFn = (key: VelvetI18nKey | (string & {}), params?: MessageParams) => string;

/**
 * Strict translation function for **literal** i18n keys.
 *
 * Identical runtime behavior to {@link TranslateFn}, but the key parameter
 * is narrowed to the augmented `VelvetI18nDictionary` only — no
 * `(string & {})` widening — so passing an unknown literal is a type error.
 *
 * Convention (enforced by ESLint `no-restricted-syntax`):
 *   - `ts('common.save')` for compile-time keys.
 *   - `t(dynamicKey)` only when the key is computed at runtime.
 */
export type TranslateStaticFn = (key: VelvetI18nKey, params?: MessageParams) => string;

export interface I18nContextValue {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  ts: TranslateStaticFn;
  formatNumber: (value: number | bigint, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) => string;
}

const I18nContext = createContext<I18nContextValue>();

const FALLBACK_DICTIONARIES: ComposedDictionaries = defineDictionaries({
  en: [builtinEn],
  pl: [builtinPl],
});

export interface I18nProviderProps extends ParentProps {
  /** Composed dictionaries (output of `defineDictionaries`). Falls back to VelvetUi foundation only. */
  dictionaries?: ComposedDictionaries;
  /** localStorage key used to persist user preference. */
  storageKey?: string;
  /** Initial locale, overrides stored/browser detection. */
  initialLocale?: Locale;
}

const resolveTemplate = (active: FlatDictionary, fallback: FlatDictionary, locale: Locale, key: string): string => {
  const direct = active[key];
  if (direct !== undefined) return direct;
  const fallbackTpl = fallback[key];
  if (fallbackTpl !== undefined) {
    if (active !== fallback) warnMissing(locale, key, true);
    return fallbackTpl;
  }
  warnMissing(locale, key, false);
  return key;
};

export const I18nProvider = (props: I18nProviderProps) => {
  const storageKey = (): string => props.storageKey ?? getVelvetRuntimeConfig().localeStorageKey;

  const [locale, setLocaleSignal] = createSignal<Locale>(props.initialLocale ?? detectInitialLocale(storageKey()));

  const dictionaries = createMemo<ComposedDictionaries>(() => props.dictionaries ?? FALLBACK_DICTIONARIES);

  const fallback = createMemo<FlatDictionary>(() => dictionaries().en);
  const active = createMemo<FlatDictionary>(() => {
    const dict = dictionaries()[locale()] as FlatDictionary | undefined;
    return dict ?? fallback();
  });

  createEffect(
    on(
      () => props.initialLocale,
      (next) => {
        if (!next) return;
        if (!(SUPPORTED_LOCALES as ReadonlyArray<string>).includes(next)) return;
        if (locale() !== next) setLocaleSignal(next);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(locale, (current) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey(), current);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', current);
      }
    }),
  );

  const t: TranslateFn = (key, params) => {
    const template = resolveTemplate(active(), fallback(), locale(), key);
    return compileMessage(template)(params, locale());
  };

  const ts: TranslateStaticFn = (key, params) => t(key, params);

  const formatNumber: I18nContextValue['formatNumber'] = (value, options) =>
    getNumberFormat(locale(), options).format(value);

  const formatDate: I18nContextValue['formatDate'] = (value, options) =>
    getDateTimeFormat(locale(), options ?? { dateStyle: 'medium' }).format(
      value instanceof Date ? value : new Date(value),
    );

  const formatRelativeTime: I18nContextValue['formatRelativeTime'] = (value, unit, options) =>
    getRelativeTimeFormat(locale(), options).format(value, unit);

  const value: I18nContextValue = {
    locale,
    setLocale: setLocaleSignal,
    t,
    ts,
    formatNumber,
    formatDate,
    formatRelativeTime,
  };

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
};

/**
 * Access the active i18n context.
 *
 * Outside of an `<I18nProvider>` returns a degraded implementation that
 * reads VelvetUi's built-in foundation dictionary so primitive components
 * remain usable in tests and Storybook-style isolation.
 */
export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (context) return context;

  const fallbackLocale: Accessor<Locale> = () => 'en';
  const fb = FALLBACK_DICTIONARIES.en;

  const fallbackT: TranslateFn = (key, params) => compileMessage(fb[key] ?? key)(params, 'en');

  return {
    locale: fallbackLocale,
    setLocale: () => undefined,
    t: fallbackT,
    ts: (key, params) => fallbackT(key, params),
    formatNumber: (value, options) => getNumberFormat('en', options).format(value),
    formatDate: (value, options) =>
      getDateTimeFormat('en', options ?? { dateStyle: 'medium' }).format(
        value instanceof Date ? value : new Date(value),
      ),
    formatRelativeTime: (value, unit, options) => getRelativeTimeFormat('en', options).format(value, unit),
  };
};
