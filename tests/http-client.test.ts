import assert from 'node:assert/strict';
import test from 'node:test';

import { createApiClients } from '../src/http/createApiClients.js';
import { createHttpClient } from '../src/http/createHttpClient.js';
import { ApiError, normalizeHttpError } from '../src/http/errors.js';
import { buildUrl, resolveRequestBody } from '../src/http/utils.js';

const toRequestUrl = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
};

void test('http client sends headers and query params', async () => {
  const calls: Array<{ url: string; init: RequestInit | undefined }> = [];

  const mockFetch: typeof fetch = (input, init) => {
    calls.push({ url: toRequestUrl(input), init });
    return Promise.resolve(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  };

  const client = createHttpClient({
    baseUrl: 'https://api.example.com',
    headers: { 'X-App': 'velvet' },
    fetch: mockFetch,
    getAccessToken: () => 'token',
  });

  const response = await client.get<{ ok: boolean }>('/users', {
    query: { page: 2, q: 'jan' },
    headers: { 'X-Trace': 'abc' },
  });

  assert.equal(response.ok, true);
  assert.equal(calls.length, 1);

  const first = calls[0];
  assert.equal(first.url, 'https://api.example.com/users?page=2&q=jan');
  assert.equal(first.init?.method, 'GET');

  assert.ok(first.init);
  const headers = new Headers(first.init.headers);
  assert.equal(headers.get('Authorization'), 'Bearer token');
  assert.equal(headers.get('X-App'), 'velvet');
  assert.equal(headers.get('X-Trace'), 'abc');
});

void test('http client throws ApiError for non-ok response', async () => {
  const client = createHttpClient({
    baseUrl: '/api',
    fetch: () =>
      Promise.resolve(
        new Response(JSON.stringify({ message: 'No access' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  });

  await assert.rejects(
    () => client.get('/private'),
    (error: unknown) => {
      assert.equal(error instanceof ApiError, true);
      const apiError = error as ApiError;
      assert.equal(apiError.status, 403);
      assert.equal(apiError.message, 'No access');
      assert.equal(apiError.url, '/api/private');
      return true;
    }
  );
});

void test('http client calls unauthorized handler for 401', async () => {
  let unauthorizedCalls = 0;

  const client = createHttpClient({
    baseUrl: '/api',
    onUnauthorized: () => {
      unauthorizedCalls += 1;
    },
    fetch: () =>
      Promise.resolve(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  });

  await assert.rejects(() => client.get('/secure'));
  assert.equal(unauthorizedCalls, 1);
});

void test('normalizeHttpError keeps Error instances and wraps unknown values', () => {
  const original = new Error('x');
  assert.equal(normalizeHttpError(original), original);
  assert.equal(normalizeHttpError('nope').message, 'Request failed');
});

void test('buildUrl supports relative and absolute base urls', () => {
  assert.equal(buildUrl('/api', '/users', { page: 1 }), '/api/users?page=1');
  assert.equal(buildUrl('https://api.example.com', '/users'), 'https://api.example.com/users');
  assert.equal(
    buildUrl('/api', '/offers', { status: ['new', 'done'], tagIds: [1, 2], empty: [null, undefined] }),
    '/api/offers?status=new&status=done&tagIds=1&tagIds=2'
  );
});

void test('resolveRequestBody serializes json and preserves FormData', () => {
  const jsonResult = resolveRequestBody({ a: 1 });
  assert.equal(jsonResult.contentType, 'application/json');
  assert.equal(jsonResult.body, JSON.stringify({ a: 1 }));

  const formData = new FormData();
  formData.append('file', new Blob(['x']), 'a.txt');
  const formDataResult = resolveRequestBody(formData);
  assert.equal(formDataResult.contentType, undefined);
  assert.equal(formDataResult.body, formData);
});

void test('http client does not force json content type for FormData', async () => {
  const calls: Array<RequestInit | undefined> = [];
  const formData = new FormData();
  formData.append('file', new Blob(['x']), 'a.txt');

  const client = createHttpClient({
    baseUrl: '/api',
    fetch: (_input, init) => {
      calls.push(init);
      return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    },
  });

  await client.post('/upload', formData);
  assert.ok(calls[0]);
  const headers = new Headers(calls[0].headers);
  assert.equal(headers.get('Content-Type'), null);
});

void test('createApiClients builds clients from provided map', async () => {
  const urls: string[] = [];
  const clients = createApiClients({
    baseUrl: 'https://api.example.com',
    clients: {
      jobs: '/organizer',
      hiring: '/questions',
      account: '/users',
    },
    getAccessToken: () => 'token',
    fetch: (input) => {
      urls.push(toRequestUrl(input));
      return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    },
  });

  await clients.jobs.get('/offers');
  await clients.hiring.get('/questions');
  await clients.account.get('/profile');

  assert.deepEqual(urls, [
    'https://api.example.com/organizer/offers',
    'https://api.example.com/questions/questions',
    'https://api.example.com/users/profile',
  ]);
});

void test('createApiClients provides default api client when map is omitted', async () => {
  const urls: string[] = [];

  const clients = createApiClients({
    baseUrl: 'https://api.example.com',
    fetch: (input) => {
      urls.push(toRequestUrl(input));
      return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    },
  });

  await clients.api.get('/health');
  assert.deepEqual(urls, ['https://api.example.com/health']);
});
