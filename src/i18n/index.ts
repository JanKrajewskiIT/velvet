/**
 * Public i18n surface for @jankrajewskiit/ui.
 *
 * Importing this module (which happens transitively from the package's
 * main entry via I18nProvider) ensures foundation messages are registered.
 *
 * Library packages (e.g. @jankrajewskiit/data) augment the registry by
 * shipping their own `<package>/i18n` entry that calls `registerI18nMessages`.
 */

import './builtin';

export { I18nProvider, useI18n } from './I18nProvider';
export type { FlatI18nDictionary, I18nMessageKey, I18nMessageRegistry, Locale } from './registry';
export { getRegisteredMessages, hasRegisteredMessage, registerI18nMessages, SUPPORTED_LOCALES } from './registry';
