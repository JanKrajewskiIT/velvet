/**
 * I18n message registry — Pattern B.
 *
 * Each package contributes its own messages by:
 *   1. Augmenting the {@link I18nMessageRegistry} interface (compile-time keys).
 *   2. Calling {@link registerI18nMessages} at module load (runtime values).
 *
 * Consumer apps trigger registration via side-effect imports, e.g.:
 *   import '@jankrajewskiit/data/i18n';
 *
 * VelvetUi's own foundation messages auto-register from the main entry
 * (see ./builtin), so importing anything from `@jankrajewskiit/ui` is enough.
 *
 * Registration is a one-shot synchronous operation; the registry is read once
 * per locale by I18nProvider via a static snapshot. Late registrations after a
 * provider has mounted are NOT picked up until the next locale change.
 */

export type Locale = 'en' | 'pl';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'pl'] as const;

export type FlatI18nDictionary = Record<string, string>;

/**
 * Augmentable registry of message keys → string templates.
 *
 * Packages should augment via:
 *   declare module '@jankrajewskiit/ui' {
 *     interface I18nMessageRegistry {
 *       'mypkg.key': string;
 *     }
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface I18nMessageRegistry {}

// `& string` keeps the key set narrowed to string keys when consumers augment
// the interface; before any augmentation the resulting type is `never`, which
// is correct (no library should call ts() before foundation registers).
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type I18nMessageKey = keyof I18nMessageRegistry & string;

const stores: Record<Locale, Map<string, string>> = {
  en: new Map(),
  pl: new Map(),
};

const registeredOrigins = new Map<string, string>();

interface RegisterOptions {
  /** Identifier of the calling package, used in dev warnings on duplicate keys. */
  source?: string;
  /** When true, silently overwrite existing keys. Default: false (warns in dev). */
  overwrite?: boolean;
}

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

/**
 * Register message templates for a given locale.
 *
 * Typically called via side-effect import from a `<package>/i18n` entry.
 * Safe to call multiple times; later registrations from the same source are
 * idempotent overwrites (no warning), while collisions across sources warn in dev.
 */
export function registerI18nMessages(
  locale: Locale,
  messages: Readonly<Record<string, string>>,
  options: RegisterOptions = {},
): void {
  const store = stores[locale];

  const source = options.source ?? '<unknown>';
  const overwrite = options.overwrite === true;

  for (const [key, value] of Object.entries(messages)) {
    if (store.has(key) && !overwrite && isDev()) {
      const previousSource = registeredOrigins.get(`${locale}:${key}`);
      if (previousSource !== source) {
        // eslint-disable-next-line no-console
        console.warn(
          `[velvet-ui i18n] Duplicate key "${key}" for locale "${locale}" registered by "${source}" (was "${previousSource ?? 'unknown'}"). Keeping previous value.`,
        );
        continue;
      }
    }
    store.set(key, value);
    registeredOrigins.set(`${locale}:${key}`, source);
  }
}

/**
 * Snapshot of all registered messages for a locale.
 * Called once per locale change by I18nProvider.
 */
export function getRegisteredMessages(locale: Locale): FlatI18nDictionary {
  const store = stores[locale];
  const out: FlatI18nDictionary = {};
  for (const [key, value] of store) out[key] = value;
  return out;
}

/**
 * Returns true if the given key is registered for the locale.
 * Used by I18nProvider for dev warnings on missing translations.
 */
export function hasRegisteredMessage(locale: Locale, key: string): boolean {
  return stores[locale].has(key);
}
