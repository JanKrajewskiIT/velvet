import { createHttpClient } from '~/http/createHttpClient';
import type { HttpClient, HttpClientConfig } from '~/http/types';

export type HttpClientMap<TClients extends Record<string, string>> = {
  [Key in keyof TClients]: HttpClient;
};

export type DefaultApiClientMap = { api: '/' };

export interface CreateApiClientsOptions<TClients extends Record<string, string> = DefaultApiClientMap> extends Omit<
  HttpClientConfig,
  'baseUrl'
> {
  baseUrl: string;
  clients?: TClients;
}

const resolveApiBase = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/u, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const createApiClients = <TClients extends Record<string, string> = DefaultApiClientMap>(
  options: CreateApiClientsOptions<TClients>,
): HttpClientMap<TClients> => {
  const sharedConfig: Omit<HttpClientConfig, 'baseUrl'> = {
    headers: options.headers,
    fetch: options.fetch,
    getAccessToken: options.getAccessToken,
    onUnauthorized: options.onUnauthorized,
    requestInterceptors: options.requestInterceptors,
    responseInterceptors: options.responseInterceptors,
  };

  const clients = {} as HttpClientMap<TClients>;

  const clientsConfig: Record<string, string> = options.clients ?? { api: '/' };

  Object.entries(clientsConfig).forEach(([key, path]) => {
    clients[key as keyof TClients] = createHttpClient({
      ...sharedConfig,
      baseUrl: resolveApiBase(options.baseUrl, path),
    });
  });

  return clients;
};
