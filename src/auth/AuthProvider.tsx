import { type User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import {
  type Accessor,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type ParentProps,
  useContext,
} from 'solid-js';

import { extractRolesFromAccessToken, getCurrentReturnUrl, isBrowserRuntime, withTimeout } from '~/auth/utils';

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

let userManagerInstance: UserManager | null = null;
let userManagerCacheKey: string | null = null;
let userManagerFactory: ((config: OidcAuthUserManagerFactoryConfig) => UserManager) | null = null;

function getUserManagerFactory(): (config: OidcAuthUserManagerFactoryConfig) => UserManager {
  if (userManagerFactory) {
    return userManagerFactory;
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
}

function setAuthUserManagerFactory(factory: ((config: OidcAuthUserManagerFactoryConfig) => UserManager) | null): void {
  userManagerFactory = factory;
  userManagerInstance = null;
  userManagerCacheKey = null;
}

function buildUserManagerCacheKey(config: OidcAuthConfig): string {
  return `${config.authority}::${config.clientId}::${config.appUrl}::${config.silentRedirectUri ?? ''}`;
}

function getUserManager(config: OidcAuthConfig): UserManager {
  if (!isBrowserRuntime()) {
    throw new Error('AuthProvider requires browser runtime.');
  }

  const cacheKey = buildUserManagerCacheKey(config);
  if (!userManagerInstance || userManagerCacheKey !== cacheKey) {
    userManagerInstance = getUserManagerFactory()({
      authority: config.authority,
      clientId: config.clientId,
      appUrl: config.appUrl,
      silentRedirectUri: config.silentRedirectUri,
      automaticSilentRenew: true,
    });
    userManagerCacheKey = cacheKey;
  }

  return userManagerInstance;
}

function getTimeoutMs(config: OidcAuthConfig): number {
  return config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
}

function normalizeReturnUrl(value: string | undefined): string {
  if (!value) {
    return '/';
  }

  if (!value.startsWith('/')) {
    return '/';
  }

  if (value.startsWith('//')) {
    return '/';
  }

  return value;
}

function getReturnUrlStorageKey(config: OidcAuthConfig): string {
  return config.returnUrlStorageKey ?? DEFAULT_RETURN_URL_STORAGE_KEY;
}

const AuthProvider = (props: AuthProviderProps) => {
  const [state, setState] = createSignal<AuthState>({
    user: null,
    isLoading: true,
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
  const userProfile = createMemo(() => state().user?.profile as Record<string, unknown> | undefined);

  const resolveProfileValue = (keys: string[]): string => {
    const profile = userProfile();
    if (!profile) {
      return '';
    }

    for (const key of keys) {
      const value = profile[key];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }

    return '';
  };

  const firstName = createMemo(() => resolveProfileValue(['given_name', 'first_name']));
  const lastName = createMemo(() => resolveProfileValue(['family_name', 'last_name']));
  const email = createMemo(() => resolveProfileValue(['email']));
  const username = createMemo(() => resolveProfileValue(['preferred_username', 'name', 'sub']));

  const isAdmin = createMemo(() => roles().some((role) => role.toLowerCase() === 'admin'));
  const isModerator = createMemo(() => roles().some((role) => role.toLowerCase() === 'moderator'));
  const isAdminOrModerator = createMemo(() => isAdmin() || isModerator());

  const accountUrl = createMemo(() => props.config.accountUrl ?? `${props.config.authority}/account`);

  function hasRole(role: string): boolean {
    return roles().some((entry) => entry.toLowerCase() === role.toLowerCase());
  }

  function hasAnyRole(...requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((requiredRole) => hasRole(requiredRole));
  }

  async function signIn(returnUrl?: string): Promise<void> {
    if (!isBrowserRuntime()) {
      return;
    }

    try {
      if (returnUrl) {
        sessionStorage.setItem(returnUrlStorageKey(), normalizeReturnUrl(returnUrl));
      }

      await userManager().signinRedirect();
    } catch (unknownError) {
      setState((previous) => ({
        ...previous,
        error: unknownError instanceof Error ? unknownError.message : 'Sign in failed',
      }));
    }
  }

  async function signOut(): Promise<void> {
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
  }

  async function signInSilent(): Promise<void> {
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
  }

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
            'Sign in callback timed out'
          );
          setState({ user: callbackUser, isLoading: false, error: null });

          const returnUrl = normalizeReturnUrl(sessionStorage.getItem(returnUrlStorageKey()) ?? undefined);
          sessionStorage.removeItem(returnUrlStorageKey());

          const targetUrl = returnUrl;
          if (getCurrentReturnUrl() !== targetUrl) {
            window.location.replace(targetUrl);
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }

  return DEFAULT_AUTH_CONTEXT_VALUE;
}

export async function getAuthAccessToken(config: OidcAuthConfig): Promise<string | undefined> {
  if (!isBrowserRuntime()) {
    return undefined;
  }

  const userManager = getUserManager(config);
  const timeoutMs = getTimeoutMs(config);
  const user = await withTimeout(userManager.getUser(), timeoutMs, 'Access token lookup timed out');

  if (!user) {
    return undefined;
  }

  if (user.expired) {
    try {
      const renewedUser = await withTimeout(userManager.signinSilent(), timeoutMs, 'Silent token renew timed out');
      return renewedUser?.access_token;
    } catch {
      return undefined;
    }
  }

  return user.access_token;
}
