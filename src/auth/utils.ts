interface AccessTokenPayload {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

export function isBrowserRuntime(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => reject(new Error(message)), timeoutMs);

    promise
      .then((value) => {
        globalThis.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error: unknown) => {
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(message));
      });
  });
}

export function decodeAccessTokenPayload(token: string): AccessTokenPayload {
  const payload = token.split('.')[1];
  if (!payload) {
    throw new Error('Invalid access token payload');
  }

  const base64 = payload.replace(/-/gu, '+').replace(/_/gu, '/');
  const json = atob(base64);
  return JSON.parse(json) as AccessTokenPayload;
}

export function extractRolesFromAccessToken(token: string | undefined): string[] {
  if (!token) {
    return [];
  }

  try {
    const payload = decodeAccessTokenPayload(token);
    const realmRoles = payload.realm_access?.roles ?? [];
    const resourceRoles = payload.resource_access
      ? Object.values(payload.resource_access).flatMap((entry) => entry.roles ?? [])
      : [];

    return [...new Set([...realmRoles, ...resourceRoles])];
  } catch {
    return [];
  }
}

export function getCurrentReturnUrl(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
