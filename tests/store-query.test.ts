import assert from 'node:assert/strict';
import test from 'node:test';

import { createSignal } from 'solid-js';

import { createQueryClient } from '../src/query/createQueryClient.js';
import { createQuerySignal } from '../src/query/createQuerySignal.js';
import { hashQueryKey } from '../src/query/key.js';
import { getDefaultQueryClient } from '../src/query/QueryClientProvider.js';
import { createAutosaveSignal } from '../src/store/createAutosaveSignal.js';
import { createEntityStore } from '../src/store/createEntityStore.js';
import { createSelectionStore } from '../src/store/createSelectionStore.js';

void test('createEntityStore manages collection', () => {
  const store = createEntityStore<{ id: string; name: string }, string>({
    getId: (item) => item.id,
  });

  store.setAll([
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
  ]);
  assert.equal(store.ids().length, 2);
  assert.equal(store.getById('2')?.name, 'B');

  store.upsert({ id: '2', name: 'B2' });
  assert.equal(store.getById('2')?.name, 'B2');

  store.remove('1');
  assert.equal(store.getById('1'), undefined);
});

void test('createSelectionStore handles state reset', () => {
  const selection = createSelectionStore({
    initialSelectedId: 'x',
    initialFilter: 'abc',
    initialSortBy: 'name',
  });

  assert.equal(selection.hasSelection(), true);
  selection.clear();
  assert.equal(selection.selectedId(), null);
  assert.equal(selection.filter(), '');
  assert.equal(selection.sortBy(), null);
});

void test('createQueryClient can set, get and invalidate data', () => {
  const client = createQueryClient();
  const key = ['tags'] as const;

  client.setQueryData(key, [{ id: '1' }]);
  assert.deepEqual(client.getQueryData(key), [{ id: '1' }]);

  const entry = client.ensureQuery<Array<{ id: string }>>(key);
  assert.equal(entry.state().updatedAt === undefined, false);

  client.invalidateQueries(['tags']);
  assert.equal(entry.state().updatedAt, undefined);
});

void test('createQueryClient exposes query defaults', () => {
  const client = createQueryClient({
    defaultOptions: {
      queries: {
        staleTime: 300000,
        retry: 1,
      },
    },
  });

  assert.equal(client.defaults.staleTime, 300000);
  assert.equal(client.defaults.retry, 1);
});

void test('query key hash is stable for object key order', () => {
  const left = hashQueryKey(['offers', { statuses: ['new'], tagIds: [2, 1] }]);
  const right = hashQueryKey(['offers', { tagIds: [2, 1], statuses: ['new'] }]);
  assert.equal(left, right);
});

void test('autosave signal flushes source through save callback', async () => {
  const [value, setValue] = createSignal('a');
  const saves: string[] = [];

  const autosave = createAutosaveSignal({
    source: value,
    save: (snapshot) => {
      saves.push(snapshot);
      return Promise.resolve();
    },
    delayMs: 1000,
  });

  setValue('b');
  await autosave.flush();
  assert.deepEqual(saves, ['b']);
  assert.equal(autosave.status(), 'saved');
});

void test('query signal retries based on client defaults', async () => {
  const client = createQueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });

  let attempts = 0;
  const querySignal = createQuerySignal({
    client,
    key: ['retry-test'],
    query: () => {
      attempts += 1;
      if (attempts === 1) {
        return Promise.reject(new Error('temporary'));
      }
      return Promise.resolve('ok');
    },
  });

  const result = await querySignal.refetch();
  assert.equal(result, 'ok');
  assert.equal(attempts, 2);
});

void test('default query client returns the same instance', () => {
  const resolveDefaultQueryClient = getDefaultQueryClient as () => unknown;
  const first = resolveDefaultQueryClient();
  const second = resolveDefaultQueryClient();
  assert.equal(first, second);
});
