import { type Accessor, createEffect, on } from 'solid-js';

import type { AuthContextValue } from '~/auth/AuthProvider';
import { createMutationSignal } from '~/query/createMutationSignal';
import type { QueryClient } from '~/query/createQueryClient';
import { createQuerySignal, type CreateQuerySignalOptions } from '~/query/createQuerySignal';
import { getDefaultQueryClient } from '~/query/queryClientContext';
import type { QueryKey } from '~/query/types';

interface MutationCallbacks<TData, TVariables> {
  onError?: (error: Error, variables: TVariables) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
}

interface AppMutationResult<TData, TVariables> {
  readonly data: TData | undefined;
  readonly error: Error | undefined;
  readonly isError: boolean;
  readonly isPending: boolean;
  readonly isSuccess: boolean;
  mutate: (variables: TVariables, callbacks?: MutationCallbacks<TData, TVariables>) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

interface AppQueryResult<TData> {
  readonly data: TData | undefined;
  readonly error: Error | undefined;
  readonly isError: boolean;
  readonly isFetching: boolean;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  invalidate: () => void;
  refetch: () => Promise<TData>;
}

type AuthStateAdapter = Pick<AuthContextValue, 'isAuthenticated' | 'user' | 'accessToken'>;

interface CreateAppQueryOptions<TData> extends Omit<CreateQuerySignalOptions<TData>, 'client'> {
  client?: QueryClient;
  auth?: AuthStateAdapter;
  watch?: Accessor<unknown>;
}

const createAppQuery = <TData>(options: CreateAppQueryOptions<TData>): AppQueryResult<TData> => {
  const auth = options.auth;
  const client = options.client ?? getDefaultQueryClient();

  const enabled = () => {
    const isEnabled = options.enabled?.() ?? true;
    if (!auth) {
      return isEnabled;
    }

    return isEnabled && (auth.isAuthenticated() || auth.user() !== null || auth.accessToken() !== undefined);
  };

  const signal = createQuerySignal({
    ...options,
    enabled,
    client,
  });

  if (auth) {
    createEffect(
      on(
        auth.accessToken,
        () => {
          signal.invalidate();
        },
        { defer: true },
      ),
    );
  }

  if (options.watch) {
    createEffect(
      on(
        options.watch,
        () => {
          signal.invalidate();
        },
        { defer: true },
      ),
    );
  }

  return {
    get data() {
      return signal.data();
    },
    get error() {
      return signal.error();
    },
    get isError() {
      return signal.status() === 'error';
    },
    get isFetching() {
      return signal.isFetching();
    },
    get isLoading() {
      return signal.status() === 'loading';
    },
    get isSuccess() {
      return signal.status() === 'success';
    },
    invalidate: signal.invalidate,
    refetch: signal.refetch,
  };
};

const createAppMutation = <TData, TVariables>(
  mutate: (variables: TVariables) => Promise<TData>,
  callbacks?: MutationCallbacks<TData, TVariables>,
): AppMutationResult<TData, TVariables> => {
  const signal = createMutationSignal(mutate, callbacks);

  return {
    get data() {
      return signal.data();
    },
    get error() {
      return signal.error();
    },
    get isError() {
      return signal.status() === 'error';
    },
    get isPending() {
      return signal.status() === 'pending';
    },
    get isSuccess() {
      return signal.status() === 'success';
    },
    mutate(variables, localCallbacks) {
      void signal
        .run(variables)
        .then((result) => {
          localCallbacks?.onSuccess?.(result, variables);
        })
        .catch((error: unknown) => {
          localCallbacks?.onError?.(error instanceof Error ? error : new Error('Mutation failed'), variables);
        });
    },
    mutateAsync: signal.run,
    reset: signal.reset,
  };
};

const invalidateQuery = (queryKey: QueryKey, client?: QueryClient): void => {
  (client ?? getDefaultQueryClient()).invalidateQueries(queryKey);
};

export type { AppMutationResult, AppQueryResult, AuthStateAdapter, CreateAppQueryOptions, MutationCallbacks };
export { createAppMutation, createAppQuery, invalidateQuery };
