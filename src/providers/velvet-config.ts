import type { OidcAuthConfig } from '~/auth/oidc';
import type { I18nDictionary, Locale } from '~/i18n/messages';
import type { CreateQueryClientOptions } from '~/query/types';

interface VelvetRuntimeConfig {
  themeStorageKey: string;
  localeStorageKey: string;
  localeDictionaries: Partial<Record<Locale, I18nDictionary>>;
  authConfig?: OidcAuthConfig;
  queryClientOptions?: CreateQueryClientOptions;
}

interface ConfigureVelvetOptions {
  themeStorageKey?: string;
  localeStorageKey?: string;
  localeDictionaries?: Partial<Record<Locale, I18nDictionary>>;
  authConfig?: OidcAuthConfig;
  queryClientOptions?: CreateQueryClientOptions;
}

const runtimeConfig: VelvetRuntimeConfig = {
  themeStorageKey: 'velvet-theme',
  localeStorageKey: 'velvet-locale',
  localeDictionaries: {},
};

const configureVelvet = (options: ConfigureVelvetOptions): void => {
  if (options.themeStorageKey !== undefined) {
    runtimeConfig.themeStorageKey = options.themeStorageKey;
  }

  if (options.localeStorageKey !== undefined) {
    runtimeConfig.localeStorageKey = options.localeStorageKey;
  }

  if (options.localeDictionaries !== undefined) {
    runtimeConfig.localeDictionaries = options.localeDictionaries;
  }

  if (options.authConfig !== undefined) {
    runtimeConfig.authConfig = options.authConfig;
  }

  if (options.queryClientOptions !== undefined) {
    runtimeConfig.queryClientOptions = options.queryClientOptions;
  }
};

const getVelvetRuntimeConfig = (): VelvetRuntimeConfig => runtimeConfig;

export type { ConfigureVelvetOptions, VelvetRuntimeConfig };
export { configureVelvet, getVelvetRuntimeConfig };
