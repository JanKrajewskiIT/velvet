import type { UserManager } from 'oidc-client-ts';
import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import {
  handleAuthRedirectCallback,
  type OidcAuthConfig,
  type OidcAuthUserManagerFactoryConfig,
  setAuthUserManagerFactory,
} from '~/auth/oidc';
import { isBrowserRuntime, normalizePathname } from '~/auth/utils';
import { configureVelvet } from '~/providers/velvet-config';

interface CreateVelvetBootstrapOptions {
  authConfig: OidcAuthConfig;
  root: string | HTMLElement;
  app: () => JSX.Element;
  authUserManagerFactory?: (config: OidcAuthUserManagerFactoryConfig) => UserManager;
  onBeforeSanitizeAuthParams?: (url: URL) => void;
}

function sanitizeAuthQueryParams(options: CreateVelvetBootstrapOptions): void {
  if (!isBrowserRuntime()) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const hasAuthQuery = currentUrl.searchParams.has('code') || currentUrl.searchParams.has('error');
  if (!hasAuthQuery) {
    return;
  }

  const isAuthCallbackPath =
    normalizePathname(currentUrl.pathname) ===
    normalizePathname(new URL(options.authConfig.appUrl, window.location.origin).pathname);
  const hasAuthState = currentUrl.searchParams.has('state') || currentUrl.searchParams.has('session_state');

  if (isAuthCallbackPath && hasAuthState) {
    return;
  }

  options.onBeforeSanitizeAuthParams?.(currentUrl);

  currentUrl.searchParams.delete('code');
  currentUrl.searchParams.delete('error');
  currentUrl.searchParams.delete('state');
  currentUrl.searchParams.delete('session_state');
  currentUrl.searchParams.delete('iss');

  const nextSearch = currentUrl.searchParams.toString();
  const nextUrl = `${currentUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${currentUrl.hash}`;
  window.history.replaceState({}, document.title, nextUrl);
}

async function bootstrapVelvetApp(options: CreateVelvetBootstrapOptions): Promise<void> {
  if (options.authUserManagerFactory) {
    setAuthUserManagerFactory(options.authUserManagerFactory);
  }

  let navigationHandled = false;
  try {
    navigationHandled = await handleAuthRedirectCallback(options.authConfig);
  } catch {
    navigationHandled = false;
  }

  if (navigationHandled) {
    return;
  }

  sanitizeAuthQueryParams(options);

  const root = typeof options.root === 'string' ? document.getElementById(options.root) : options.root;
  if (!root) {
    throw new Error('Root element not found');
  }

  configureVelvet({ authConfig: options.authConfig });
  render(options.app, root);
}

export type { CreateVelvetBootstrapOptions };
export { bootstrapVelvetApp, sanitizeAuthQueryParams };
