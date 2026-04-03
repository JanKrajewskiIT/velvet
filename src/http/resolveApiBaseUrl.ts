interface ResolveApiBaseUrlOptions {
  configuredBaseUrl: string | undefined;
  isDev: boolean;
  devProxyPath?: string;
}

const resolveApiBaseUrl = (options: ResolveApiBaseUrlOptions): string => {
  const normalizedBaseUrl = options.configuredBaseUrl?.trim() ?? '';

  if (!options.isDev || normalizedBaseUrl.length > 0) {
    return normalizedBaseUrl;
  }

  return options.devProxyPath ?? '/api';
};

export type { ResolveApiBaseUrlOptions };
export { resolveApiBaseUrl };
