import { createEffect, createMemo, createSignal, on } from 'solid-js';

import type { QueryClient } from '~/query/createQueryClient';
import { useQueryClient } from '~/query/queryClientContext';
import type { QueryKey, QueryOptions, QueryRetry, QuerySignal, QueryState } from '~/query/types';

export interface CreateQuerySignalOptions<TData> extends QueryOptions<TData> {
  key: QueryKey;
  query: (signal?: AbortSignal) => Promise<TData>;
  client?: QueryClient;
}

export function createQuerySignal<TData>(options: CreateQuerySignalOptions<TData>): QuerySignal<TData> {
  const client = options.client ?? useQueryClient();
  const staleTime = options.staleTime ?? client.defaults.staleTime;
  const retry = options.retry ?? client.defaults.retry;
  const [activeAbort, setActiveAbort] = createSignal<AbortController | undefined>(undefined);
  const entry = client.ensureQuery<TData>(options.key);

  const shouldRetry = (attempt: number, error: Error, retryOption: QueryRetry): boolean => {
    if (typeof retryOption === 'number') {
      return attempt <= retryOption;
    }

    return retryOption(attempt, error);
  };

  const runQueryWithRetry = async (signal: AbortSignal): Promise<TData> => {
    let attempt = 0;

    for (;;) {
      attempt += 1;
      try {
        return await options.query(signal);
      } catch (error: unknown) {
        const normalized = error instanceof Error ? error : new Error('Query failed');
        if (!shouldRetry(attempt, normalized, retry)) {
          throw normalized;
        }
      }
    }
  };

  if (options.initialData !== undefined && entry.state().status === 'idle') {
    entry.setState({
      status: 'success',
      data: options.initialData,
      error: undefined,
      updatedAt: Date.now(),
      isFetching: false,
    });
  }

  const isStale = createMemo(() => {
    const state = entry.state();
    if (state.updatedAt === undefined) {
      return true;
    }

    if (staleTime <= 0) {
      return true;
    }

    return Date.now() - state.updatedAt > staleTime;
  });

  const refetch = async (): Promise<TData> => {
    if (entry.inFlight) {
      return entry.inFlight;
    }

    activeAbort()?.abort();
    const controller = new AbortController();
    setActiveAbort(controller);

    entry.setState((previous: QueryState<TData>) => ({
      ...previous,
      status: previous.status === 'idle' ? 'loading' : previous.status,
      isFetching: true,
      error: undefined,
    }));

    const pending = runQueryWithRetry(controller.signal)
      .then((data) => {
        entry.setState({
          status: 'success',
          data,
          error: undefined,
          updatedAt: Date.now(),
          isFetching: false,
        });
        return data;
      })
      .catch((error: unknown) => {
        const normalized = error instanceof Error ? error : new Error('Query failed');
        entry.setState((previous: QueryState<TData>) => ({
          ...previous,
          status: 'error',
          error: normalized,
          isFetching: false,
        }));
        throw normalized;
      })
      .finally(() => {
        if (Object.is(entry.inFlight, pending)) {
          entry.inFlight = null;
        }
      });

    entry.inFlight = pending;
    return pending;
  };

  const invalidate = () => {
    entry.invalidate();
  };

  const setData = (updater: TData | ((previous: TData | undefined) => TData)) => {
    client.setQueryData(options.key, updater);
  };

  const status = createMemo(() => {
    const current = entry.state();
    return current.status;
  });

  const data = createMemo(() => {
    const current = entry.state();
    return current.data;
  });

  const error = createMemo(() => {
    const current = entry.state();
    return current.error;
  });

  const updatedAt = createMemo(() => {
    const current = entry.state();
    return current.updatedAt;
  });

  const isFetching = createMemo(() => {
    const current = entry.state();
    return current.isFetching;
  });

  createEffect(
    on(
      () => [options.enabled?.() ?? true, isStale()] as const,
      ([enabled, stale]) => {
        if (!enabled || !stale) {
          return;
        }

        void refetch();
      },
      { defer: true }
    )
  );

  return {
    status,
    data,
    error,
    updatedAt,
    isFetching,
    isStale,
    refetch,
    invalidate,
    setData,
  };
}
