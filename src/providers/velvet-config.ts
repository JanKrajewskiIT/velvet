import type { I18nDictionary, Locale } from '~/i18n/messages';

interface VelvetRuntimeConfig {
  themeStorageKey: string;
  localeStorageKey: string;
  localeDictionaries: Partial<Record<Locale, I18nDictionary>>;
}

interface ConfigureVelvetOptions {
  themeStorageKey?: string;
  localeStorageKey?: string;
  localeDictionaries?: Partial<Record<Locale, I18nDictionary>>;
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
};

const getVelvetRuntimeConfig = (): VelvetRuntimeConfig => runtimeConfig;

export type { ConfigureVelvetOptions, VelvetRuntimeConfig };
export { configureVelvet, getVelvetRuntimeConfig };
