import { createMemo, createSignal } from 'solid-js';

import type { MutationOptions, MutationSignal, MutationState } from '~/query/types';

export const createMutationSignal = <TData, TVariables>(
  mutate: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {},
): MutationSignal<TData, TVariables> => {
  const [state, setState] = createSignal<MutationState<TData>>({
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  const run = async (variables: TVariables): Promise<TData> => {
    setState((previous) => ({
      ...previous,
      status: 'pending',
      error: undefined,
    }));

    try {
      const result = await mutate(variables);
      setState({
        status: 'success',
        data: result,
        error: undefined,
      });
      options.onSuccess?.(result, variables);
      return result;
    } catch (error: unknown) {
      const normalized = error instanceof Error ? error : new Error('Mutation failed');
      setState((previous) => ({
        ...previous,
        status: 'error',
        error: normalized,
      }));
      options.onError?.(normalized, variables);
      throw normalized;
    }
  };

  const reset = () => {
    setState({
      status: 'idle',
      data: undefined,
      error: undefined,
    });
  };

  const status = createMemo(() => state().status);
  const data = createMemo(() => state().data);
  const error = createMemo(() => state().error);

  return {
    status,
    data,
    error,
    run,
    reset,
  };
};
