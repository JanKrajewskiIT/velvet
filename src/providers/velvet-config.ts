import type { OidcAuthConfig } from '~/auth/oidc';
import type { CreateQueryClientOptions } from '~/query/types';

interface VelvetRuntimeConfig {
  themeStorageKey: string;
  localeStorageKey: string;
  authConfig?: OidcAuthConfig;
  queryClientOptions?: CreateQueryClientOptions;
}

interface ConfigureVelvetOptions {
  themeStorageKey?: string;
  localeStorageKey?: string;
  authConfig?: OidcAuthConfig;
  queryClientOptions?: CreateQueryClientOptions;
}

const runtimeConfig: VelvetRuntimeConfig = {
  themeStorageKey: 'velvet-theme',
  localeStorageKey: 'velvet-locale',
};

const configureVelvet = (options: ConfigureVelvetOptions): void => {
  if (options.themeStorageKey !== undefined) {
    runtimeConfig.themeStorageKey = options.themeStorageKey;
  }

  if (options.localeStorageKey !== undefined) {
    runtimeConfig.localeStorageKey = options.localeStorageKey;
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
