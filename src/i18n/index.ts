/**
 * Public surface of `@jankrajewskiit/ui/i18n`.
 *
 * Apps consume:
 *   - `VelvetProvider` (re-exported from the main entry) for the standard setup, or
 *   - `I18nProvider` directly for fine-grained control.
 *
 * Libraries (e.g. `@jankrajewskiit/data`) export their own `en` / `pl`
 * nested dictionaries plus a TypeScript module augmentation extending
 * `VelvetI18nDictionary` so the global key set grows with every layer.
 */

export { en, pl, type VelvetUiFoundationDictionary } from './builtin';
export type { ComposedDictionaries, DictionaryInput, LocaleDictionariesInput } from './defineDictionary';
export { defineDictionaries, defineDictionary } from './defineDictionary';
export type { CompiledMessage } from './format/compiler';
export { compileMessage } from './format/compiler';
export type { I18nContextValue, I18nProviderProps, TranslateFn } from './I18nProvider';
export { I18nProvider, useI18n } from './I18nProvider';
export type {
  DictionaryNode,
  DotPath,
  FlatDictionary,
  Locale,
  MessageParams,
  VelvetI18nDictionary,
  VelvetI18nKey,
} from './types';
export { SUPPORTED_LOCALES } from './types';
