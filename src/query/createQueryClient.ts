import { type Accessor, createSignal } from 'solid-js';

import { hashQueryKey, matchesPartialKey } from '~/query/key';
import type { CreateQueryClientOptions, QueryDefaults, QueryKey, QueryState } from '~/query/types';

export interface QueryClientEntry<TData = unknown> {
  state: Accessor<QueryState<TData>>;
  setState: (next: QueryState<TData> | ((previous: QueryState<TData>) => QueryState<TData>)) => void;
  inFlight: Promise<TData> | null;
  invalidate: () => void;
}

export interface QueryClient {
  ensureQuery<TData>(key: QueryKey): QueryClientEntry<TData>;
  getQueryData(key: QueryKey): unknown;
  setQueryData<TData>(key: QueryKey, updater: TData | ((previous: TData | undefined) => TData)): void;
  invalidateQueries(partialKey?: QueryKey): void;
  defaults: QueryDefaults;
}

const DEFAULT_QUERY_DEFAULTS: QueryDefaults = {
  staleTime: 0,
  retry: 0,
};

export function createQueryClient(options: CreateQueryClientOptions = {}): QueryClient {
  const cache = new Map<string, { key: QueryKey; entry: QueryClientEntry<unknown> }>();
  const defaults: QueryDefaults = {
    ...DEFAULT_QUERY_DEFAULTS,
    ...(options.defaultOptions?.queries ?? {}),
  };

  const ensureQuery = <TData>(key: QueryKey): QueryClientEntry<TData> => {
    const keyHash = hashQueryKey(key);
    const existing = cache.get(keyHash)?.entry;
    if (existing) {
      return existing as QueryClientEntry<TData>;
    }

    const [state, setState] = createSignal<QueryState<TData>>({
      status: 'idle',
      data: undefined,
      error: undefined,
      updatedAt: undefined,
      isFetching: false,
    });

    const entry: QueryClientEntry<TData> = {
      state,
      setState,
      inFlight: null,
      invalidate: () => {
        setState((previous) => ({
          ...previous,
          updatedAt: undefined,
        }));
      },
    };

    cache.set(keyHash, { key, entry: entry as QueryClientEntry<unknown> });
    return entry;
  };

  const getQueryData = (key: QueryKey): unknown => {
    const keyHash = hashQueryKey(key);
    const record = cache.get(keyHash);
    if (!record) {
      return undefined;
    }

    return record.entry.state().data;
  };

  const setQueryData = <TData>(key: QueryKey, updater: TData | ((previous: TData | undefined) => TData)): void => {
    const entry = ensureQuery<TData>(key);

    entry.setState((previous) => {
      const nextData =
        typeof updater === 'function' ? (updater as (data: TData | undefined) => TData)(previous.data) : updater;
      return {
        status: 'success',
        data: nextData,
        error: undefined,
        updatedAt: Date.now(),
        isFetching: false,
      };
    });
  };

  const invalidateQueries = (partialKey?: QueryKey): void => {
    cache.forEach((record) => {
      if (!partialKey) {
        record.entry.invalidate();
        return;
      }

      if (matchesPartialKey(record.key, partialKey)) {
        record.entry.invalidate();
      }
    });
  };

  return {
    ensureQuery,
    getQueryData,
    setQueryData,
    invalidateQueries,
    defaults,
  };
}
