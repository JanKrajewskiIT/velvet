import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import {
  type Accessor,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type ParentProps,
  untrack,
  useContext,
} from 'solid-js';

import {
  extractRolesFromAccessToken,
  getCurrentReturnUrl,
  getStoredUser,
  isBrowserRuntime,
  isOidcCallbackReturnUrl,
  matchesAnyRole,
  matchesRole,
  normalizeReturnUrl,
  resolveCallbackReturnUrl,
  resolveProfileValue,
  withTimeout,
} from '~/auth/utils';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface OidcAuthConfig {
  authority: string;
  clientId: string;
  appUrl: string;
  silentRedirectUri?: string;
  accountUrl?: string;
  timeoutMs?: number;
  returnUrlStorageKey?: string;
}

interface OidcAuthUserManagerFactoryConfig {
  authority: string;
  clientId: string;
  appUrl: string;
  silentRedirectUri?: string;
  automaticSilentRenew?: boolean;
}

interface AuthContextValue {
  user: Accessor<User | null>;
  isLoading: Accessor<boolean>;
  isAuthenticated: Accessor<boolean>;
  error: Accessor<string | null>;
  accessToken: Accessor<string | undefined>;
  roles: Accessor<string[]>;
  firstName: Accessor<string>;
  lastName: Accessor<string>;
  email: Accessor<string>;
  username: Accessor<string>;
  accountUrl: Accessor<string>;
  signIn: (returnUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInSilent: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (...roles: string[]) => boolean;
  isAdmin: Accessor<boolean>;
  isModerator: Accessor<boolean>;
  isAdminOrModerator: Accessor<boolean>;
}

interface AuthProviderProps extends ParentProps {
  config: OidcAuthConfig;
}

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETURN_URL_STORAGE_KEY = 'velvet-auth-return-url';

const AuthContext = createContext<AuthContextValue>();

const DEFAULT_AUTH_CONTEXT_VALUE: AuthContextValue = {
  user: () => null,
  isLoading: () => false,
  isAuthenticated: () => false,
  error: () => null,
  accessToken: () => undefined,
  roles: () => [],
  firstName: () => '',
  lastName: () => '',
  email: () => '',
  username: () => '',
  accountUrl: () => '',
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signInSilent: () => Promise.resolve(),
  hasRole: () => false,
  hasAnyRole: () => false,
  isAdmin: () => false,
  isModerator: () => false,
  isAdminOrModerator: () => false,
};

const userManagerCache = {
  instance: null as UserManager | null,
  cacheKey: null as string | null,
  factory: null as ((config: OidcAuthUserManagerFactoryConfig) => UserManager) | null,
};

const getResolvedFactory = (): ((config: OidcAuthUserManagerFactoryConfig) => UserManager) => {
  if (userManagerCache.factory) {
    return userManagerCache.factory;
  }

  return (config) =>
    new UserManager({
      authority: config.authority,
      client_id: config.clientId,
      redirect_uri: config.appUrl,
      post_logout_redirect_uri: config.appUrl,
      silent_redirect_uri: config.silentRedirectUri,
      userStore: new WebStorageStateStore({ store: sessionStorage }),
      automaticSilentRenew: config.automaticSilentRenew ?? true,
    });
};

const setAuthUserManagerFactory = (
  factory: ((config: OidcAuthUserManagerFactoryConfig) => UserManager) | null,
): void => {
  userManagerCache.factory = factory;
  userManagerCache.instance = null;
  userManagerCache.cacheKey = null;
};

const buildCacheKey = (config: OidcAuthConfig): string =>
  `${config.authority}::${config.clientId}::${config.appUrl}::${config.silentRedirectUri ?? ''}`;

const getUserManager = (config: OidcAuthConfig): UserManager => {
  if (!isBrowserRuntime()) {
    throw new Error('AuthProvider requires browser runtime.');
  }

  const cacheKey = buildCacheKey(config);
  if (!userManagerCache.instance || userManagerCache.cacheKey !== cacheKey) {
    userManagerCache.instance = getResolvedFactory()({
      authority: config.authority,
      clientId: config.clientId,
      appUrl: config.appUrl,
      silentRedirectUri: config.silentRedirectUri,
      automaticSilentRenew: true,
    });
    userManagerCache.cacheKey = cacheKey;
  }

  return userManagerCache.instance;
};

const getTimeoutMs = (config: OidcAuthConfig): number => config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

const getReturnUrlStorageKey = (config: OidcAuthConfig): string =>
  config.returnUrlStorageKey ?? DEFAULT_RETURN_URL_STORAGE_KEY;

const AuthProvider = (props: AuthProviderProps) => {
  const initialConfig = untrack(() => props.config);
  const hasCallbackQuery =
    isBrowserRuntime() && (window.location.search.includes('code=') || window.location.search.includes('error='));

  const [state, setState] = createSignal<AuthState>({
    user: getStoredUser(initialConfig.authority, initialConfig.clientId),
    isLoading: hasCallbackQuery,
    error: null,
  });

  const userManager = createMemo(() => getUserManager(props.config));
  const timeoutMs = createMemo(() => getTimeoutMs(props.config));
  const returnUrlStorageKey = createMemo(() => getReturnUrlStorageKey(props.config));

  const user = createMemo(() => state().user);
  const isLoading = createMemo(() => state().isLoading);
  const error = createMemo(() => state().error);
  const isAuthenticated = createMemo(() => state().user !== null && state().user?.expired === false);
  const accessToken = createMemo(() => state().user?.access_token);
  const roles = createMemo(() => extractRolesFromAccessToken(accessToken()));

  const firstName = createMemo(() => resolveProfileValue(user(), ['given_name', 'first_name']));
  const lastName = createMemo(() => resolveProfileValue(user(), ['family_name', 'last_name']));
  const email = createMemo(() => resolveProfileValue(user(), ['email']));
  const username = createMemo(() => resolveProfileValue(user(), ['preferred_username', 'name', 'sub']));

  const isAdmin = createMemo(() => matchesRole(roles(), 'admin'));
  const isModerator = createMemo(() => matchesRole(roles(), 'moderator'));
  const isAdminOrModerator = createMemo(() => isAdmin() || isModerator());

  const accountUrl = createMemo(() => props.config.accountUrl ?? `${props.config.authority}/account`);

  const hasRole = (role: string): boolean => matchesRole(roles(), role);
  const hasAnyRole = (...requiredRoles: string[]): boolean => matchesAnyRole(roles(), ...requiredRoles);

  const signIn = async (returnUrl?: string): Promise<void> => {
    if (!isBrowserRuntime()) {
      return;
    }

    try {
      const normalizedReturnUrl = returnUrl ? normalizeReturnUrl(returnUrl) : undefined;
      const safeReturnUrl =
        normalizedReturnUrl && !isOidcCallbackReturnUrl(normalizedReturnUrl, props.config.appUrl)
          ? normalizedReturnUrl
          : undefined;

      if (safeReturnUrl) {
        sessionStorage.setItem(returnUrlStorageKey(), safeReturnUrl);
      }

      await userManager().signinRedirect(safeReturnUrl ? { state: { returnUrl: safeReturnUrl } } : undefined);
    } catch (unknownError) {
      setState((previous) => ({
        ...previous,
        error: unknownError instanceof Error ? unknownError.message : 'Sign in failed',
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    if (!isBrowserRuntime()) {
      return;
    }

    try {
      await userManager().signoutRedirect();
    } catch (unknownError) {
      setState((previous) => ({
        ...previous,
        error: unknownError instanceof Error ? unknownError.message : 'Sign out failed',
      }));
    }
  };

  const signInSilent = async (): Promise<void> => {
    if (!isBrowserRuntime()) {
      return;
    }

    try {
      const renewedUser = await withTimeout(userManager().signinSilent(), timeoutMs(), 'Silent sign in timed out');
      setState({ user: renewedUser, isLoading: false, error: null });
    } catch (unknownError) {
      setState((previous) => ({
        ...previous,
        isLoading: false,
        error: unknownError instanceof Error ? unknownError.message : 'Silent sign in failed',
      }));
    }
  };

  onMount(() => {
    if (!isBrowserRuntime()) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }

    void (async () => {
      try {
        if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
          const callbackUser = await withTimeout(
            userManager().signinRedirectCallback(),
            timeoutMs(),
            'Sign in callback timed out',
          );
          setState({ user: callbackUser, isLoading: false, error: null });

          const storedReturnUrl = sessionStorage.getItem(returnUrlStorageKey()) ?? undefined;
          sessionStorage.removeItem(returnUrlStorageKey());
          const stateReturnUrl = resolveCallbackReturnUrl(callbackUser.state, props.config.appUrl);
          const safeStoredReturnUrl =
            storedReturnUrl && !isOidcCallbackReturnUrl(storedReturnUrl, props.config.appUrl)
              ? normalizeReturnUrl(storedReturnUrl)
              : undefined;
          const targetReturnUrl = stateReturnUrl ?? safeStoredReturnUrl ?? '/';

          if (getCurrentReturnUrl() !== targetReturnUrl) {
            window.location.replace(targetReturnUrl);
          } else {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          }

          return;
        }

        const existingUser = await withTimeout(userManager().getUser(), timeoutMs(), 'Auth initialization timed out');
        setState({ user: existingUser, isLoading: false, error: null });
      } catch (unknownError) {
        setState({
          user: null,
          isLoading: false,
          error: unknownError instanceof Error ? unknownError.message : 'Auth initialization failed',
        });
      }
    })();
  });

  onMount(() => {
    if (!isBrowserRuntime()) {
      return;
    }

    const onUserLoaded = (loadedUser: User) => {
      setState({ user: loadedUser, isLoading: false, error: null });
    };

    const onUserUnloaded = () => {
      setState({ user: null, isLoading: false, error: null });
    };

    const onSilentRenewError = (renewError: Error) => {
      setState((previous) => ({
        ...previous,
        error: renewError.message,
      }));
    };

    const onAccessTokenExpired = () => {
      setState((previous) => ({
        ...previous,
        user: null,
      }));
    };

    userManager().events.addUserLoaded(onUserLoaded);
    userManager().events.addUserUnloaded(onUserUnloaded);
    userManager().events.addSilentRenewError(onSilentRenewError);
    userManager().events.addAccessTokenExpired(onAccessTokenExpired);

    onCleanup(() => {
      userManager().events.removeUserLoaded(onUserLoaded);
      userManager().events.removeUserUnloaded(onUserUnloaded);
      userManager().events.removeSilentRenewError(onSilentRenewError);
      userManager().events.removeAccessTokenExpired(onAccessTokenExpired);
    });
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        error,
        accessToken,
        roles,
        firstName,
        lastName,
        email,
        username,
        accountUrl,
        signIn,
        signOut,
        signInSilent,
        hasRole,
        hasAnyRole,
        isAdmin,
        isModerator,
        isAdminOrModerator,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export type { AuthContextValue, OidcAuthConfig, OidcAuthUserManagerFactoryConfig };
export { setAuthUserManagerFactory };

export const useAuth = (): AuthContextValue => useContext(AuthContext) ?? DEFAULT_AUTH_CONTEXT_VALUE;

export const handleAuthRedirectCallback = async (config: OidcAuthConfig): Promise<boolean> => {
  if (!isBrowserRuntime()) {
    return false;
  }

  if (!isOidcCallbackReturnUrl(window.location.href, config.appUrl)) {
    return false;
  }

  const callbackUser = await getUserManager(config).signinRedirectCallback(window.location.href);
  const stateReturnUrl = resolveCallbackReturnUrl(callbackUser.state, config.appUrl);
  const storageKey = getReturnUrlStorageKey(config);
  const storedReturnUrl = sessionStorage.getItem(storageKey) ?? undefined;
  sessionStorage.removeItem(storageKey);

  const safeStoredReturnUrl =
    storedReturnUrl && !isOidcCallbackReturnUrl(storedReturnUrl, config.appUrl)
      ? normalizeReturnUrl(storedReturnUrl)
      : undefined;
  const targetUrl = stateReturnUrl ?? safeStoredReturnUrl ?? '/';
  const currentReturnUrl = getCurrentReturnUrl();

  if (currentReturnUrl !== targetUrl) {
    window.location.replace(targetUrl);
    return true;
  }

  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  return false;
};

export const getAuthAccessToken = async (config: OidcAuthConfig): Promise<string | undefined> => {
  if (!isBrowserRuntime()) {
    return undefined;
  }

  const manager = getUserManager(config);
  const timeout = getTimeoutMs(config);
  const user = await withTimeout(manager.getUser(), timeout, 'Access token lookup timed out');

  if (!user) {
    return undefined;
  }

  if (user.expired) {
    try {
      const renewedUser = await withTimeout(manager.signinSilent(), timeout, 'Silent token renew timed out');
      return renewedUser?.access_token;
    } catch {
      return undefined;
    }
  }

  return user.access_token;
};
