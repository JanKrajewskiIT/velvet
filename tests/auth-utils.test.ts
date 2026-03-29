import assert from 'node:assert/strict';
import test from 'node:test';

import { extractRolesFromAccessToken, getCurrentReturnUrl, isBrowserRuntime, withTimeout } from '../src/auth/utils.js';

function encodeBase64(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function buildJwt(payload: Record<string, unknown>): string {
  return `${encodeBase64('{"alg":"none","typ":"JWT"}')}.${encodeBase64(JSON.stringify(payload))}.signature`;
}

void test('extractRolesFromAccessToken merges realm and resource roles', () => {
  const token = buildJwt({
    realm_access: { roles: ['admin'] },
    resource_access: {
      app: { roles: ['user', 'moderator'] },
    },
  });

  const roles = extractRolesFromAccessToken(token);
  assert.deepEqual(roles.sort(), ['admin', 'moderator', 'user']);
});

void test('extractRolesFromAccessToken returns empty array for invalid token', () => {
  assert.deepEqual(extractRolesFromAccessToken('invalid.token'), []);
  assert.deepEqual(extractRolesFromAccessToken(undefined), []);
});

void test('withTimeout resolves successful promise', async () => {
  const result = await withTimeout(Promise.resolve('ok'), 100, 'timeout');
  assert.equal(result, 'ok');
});

void test('withTimeout rejects when timeout elapsed', async () => {
  await assert.rejects(
    () => withTimeout(new Promise(() => undefined), 10, 'timed out'),
    (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal((error as Error).message, 'timed out');
      return true;
    }
  );
});

void test('browser runtime helpers are stable in test environment', () => {
  assert.equal(isBrowserRuntime(), false);
  assert.equal(getCurrentReturnUrl(), '/');
});
