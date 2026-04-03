import { createMemo } from 'solid-js';

import type { AuthContextValue, OidcAuthConfig } from '~/auth/AuthProvider';
import {
  extractRolesFromAccessToken,
  getStoredUser,
  matchesAnyRole,
  matchesRole,
  resolveProfileValue,
} from '~/auth/utils';

interface SessionUserConfig {
  authority: OidcAuthConfig['authority'];
  clientId: OidcAuthConfig['clientId'];
}

const createAuthContextWithSessionFallback = (auth: AuthContextValue, config: SessionUserConfig): AuthContextValue => {
  const user = createMemo(() => auth.user() ?? getStoredUser(config.authority, config.clientId));
  const accessToken = createMemo(() => auth.accessToken() ?? user()?.access_token);
  const roles = createMemo(() => {
    const authRoles = auth.roles();
    if (authRoles.length > 0) {
      return authRoles;
    }

    return extractRolesFromAccessToken(accessToken());
  });
  const isAuthenticated = createMemo(() => auth.isAuthenticated() || Boolean(accessToken()));
  const firstName = createMemo(() => auth.firstName() || resolveProfileValue(user(), ['given_name', 'first_name']));
  const lastName = createMemo(() => auth.lastName() || resolveProfileValue(user(), ['family_name', 'last_name']));
  const email = createMemo(() => auth.email() || resolveProfileValue(user(), ['email']));
  const username = createMemo(
    () => auth.username() || resolveProfileValue(user(), ['preferred_username', 'name', 'sub']),
  );

  const hasRole = (role: string) => matchesRole(roles(), role);
  const hasAnyRole = (...requiredRoles: string[]) => matchesAnyRole(roles(), ...requiredRoles);
  const isAdmin = createMemo(() => matchesRole(roles(), 'admin'));
  const isModerator = createMemo(() => matchesRole(roles(), 'moderator'));
  const isAdminOrModerator = createMemo(() => isAdmin() || isModerator());

  return {
    ...auth,
    user,
    accessToken,
    roles,
    isAuthenticated,
    firstName,
    lastName,
    email,
    username,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isAdminOrModerator,
  };
};

export { createAuthContextWithSessionFallback };
