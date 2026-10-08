import {
  flatten,
  type I18nKey,
  lookup,
  type MessageParams,
  type RichMessageParams,
  useI18n,
} from '@jankrajewskiit/i18n';
import type { JSX } from 'solid-js';

import { velvetEn } from './en';

const ENGLISH_DEFAULTS = flatten(velvetEn);

/** Translates a library message; falls back to the bundled English text when the host did not compose `velvetMessages`. */
export const useTranslate = (): ((key: I18nKey, params?: MessageParams) => string) => {
  const { t, ts } = useI18n();
  return (key, params) => {
    const translated = ts(key, params);
    if (translated !== key) return translated;
    const template = lookup(ENGLISH_DEFAULTS, key);
    return template === undefined ? key : t(template, params);
  };
};

/** Rich-text counterpart of `useTranslate`: `<tag>…</tag>` placeholders are rendered by handler params. */
export const useTranslateRich = (): ((key: I18nKey, params?: RichMessageParams) => JSX.Element) => {
  const { ts, tx } = useI18n();
  return (key, params) => {
    if (ts(key) !== key) return tx(key, params);
    const template = lookup(ENGLISH_DEFAULTS, key);
    return template === undefined ? key : tx(template as I18nKey, params);
  };
};
