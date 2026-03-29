import { ApiError } from '~/http/errors';
import type { HttpClient, HttpClientConfig, HttpRequestOptions } from '~/http/types';
import { buildUrl, parseResponseBody, resolveRequestBody } from '~/http/utils';

export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
  const fetchImpl = config.fetch ?? globalThis.fetch;

  const baseUrl = config.baseUrl ?? '';

  async function request<T>(method: string, path: string, options: HttpRequestOptions = {}): Promise<T> {
    const token = await config.getAccessToken?.();
    const resolvedBody = resolveRequestBody(options.body);

    const headers = {
      Accept: 'application/json',
      ...(resolvedBody.contentType ? { 'Content-Type': resolvedBody.contentType } : {}),
      ...(config.headers ?? {}),
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const url = buildUrl(baseUrl, path, options.query);

    const response = await fetchImpl(url, {
      method,
      headers,
      body: resolvedBody.body,
      signal: options.signal,
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      if (response.status === 401 && config.onUnauthorized) {
        await config.onUnauthorized();
      }

      const message =
        typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
          ? data.message
          : `HTTP ${response.status}`;

      throw new ApiError(message, {
        status: response.status,
        url,
        details: data,
      });
    }

    return data as T;
  }

  return {
    request,
    get: (path, options) => request('GET', path, options),
    post: (path, body, options) => request('POST', path, { ...options, body }),
    put: (path, body, options) => request('PUT', path, { ...options, body }),
    patch: (path, body, options) => request('PATCH', path, { ...options, body }),
    delete: (path, options) => request('DELETE', path, options),
  };
}
