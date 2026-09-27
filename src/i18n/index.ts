import type { DictionaryNode, DotPath, TranslationOf } from '@jankrajewskiit/i18n';

import type { en as enDictionary } from './en';

export { en } from './en';
export { pl } from './pl';
export type {
  ComposedDictionaries,
  DictionaryNode,
  DotPath,
  FlatDictionary,
  I18nContextValue,
  I18nDictionary,
  I18nKey,
  I18nProviderProps,
  Locale,
  LocaleDictionariesInput,
  MessageParams,
  RichMessageParams,
  TagHandler,
  TranslateFn,
  TranslateRichFn,
  TranslateStaticFn,
  TranslationOf,
} from '@jankrajewskiit/i18n';
export { defineDictionaries, defineDictionary, I18nProvider, SUPPORTED_LOCALES, useI18n } from '@jankrajewskiit/i18n';

export type DictionaryInput = DictionaryNode;
export type VelvetUiFoundationDictionary = TranslationOf<typeof enDictionary>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Extension point for consumer i18n dictionaries.
export interface VelvetI18nDictionary extends VelvetUiFoundationDictionary {}
export type VelvetI18nKey = DotPath<VelvetI18nDictionary>;
