import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

import type { OidcAuthUserManagerFactoryConfig } from '~/auth/AuthProvider';

interface CreateCachedOidcUserManagerFactoryOptions {
  userStore?: Storage;
  stateStore?: Storage;
  cacheKeySuffix?: string;
  automaticSilentRenew?: boolean;
}

const createCachedOidcUserManagerFactory = (options: CreateCachedOidcUserManagerFactoryOptions = {}) => {
  let instance: UserManager | null = null;
  let cacheKey: string | null = null;

  return (config: OidcAuthUserManagerFactoryConfig): UserManager => {
    const nextCacheKey = [
      config.authority,
      config.clientId,
      config.appUrl,
      config.silentRedirectUri ?? '',
      options.cacheKeySuffix ?? '',
    ].join('::');

    if (instance && cacheKey === nextCacheKey) {
      return instance;
    }

    instance = new UserManager({
      authority: config.authority,
      client_id: config.clientId,
      redirect_uri: config.appUrl,
      post_logout_redirect_uri: config.appUrl,
      silent_redirect_uri: config.silentRedirectUri,
      userStore: options.userStore ? new WebStorageStateStore({ store: options.userStore }) : undefined,
      stateStore: options.stateStore ? new WebStorageStateStore({ store: options.stateStore }) : undefined,
      automaticSilentRenew: config.automaticSilentRenew ?? options.automaticSilentRenew ?? true,
    });

    cacheKey = nextCacheKey;
    return instance;
  };
};

export type { CreateCachedOidcUserManagerFactoryOptions };
export { createCachedOidcUserManagerFactory };
