import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

import { normalizeOption, type SelectOption } from './selectOption';

export const ASYNC_OPTIONS_DELAY_MS = 250;

export type LoadOptions = (query: string) => Promise<ReadonlyArray<string | SelectOption>>;

export interface AsyncOptions {
  items: Accessor<SelectOption[]>;
  loading: Accessor<boolean>;
  /** The last load rejected; cleared by the next attempt. */
  failed: Accessor<boolean>;
  retry: () => void;
}

interface AsyncOptionsState {
  items: SelectOption[];
  loading: boolean;
  failed: boolean;
}

const idleState = (): AsyncOptionsState => ({ items: [], loading: false, failed: false });

/**
 * Debounced server search for option lists. A result is applied only while its query is still the latest one
 * (changing the query, closing the list or disposing the owner invalidates it), so slow responses never overwrite newer ones.
 */
export const createAsyncOptions = (
  load: Accessor<LoadOptions | undefined>,
  query: Accessor<string>,
  enabled: Accessor<boolean>,
  delayMs = ASYNC_OPTIONS_DELAY_MS,
): AsyncOptions => {
  const [state, setState] = createSignal(idleState());
  const [attempt, setAttempt] = createSignal(0);

  createEffect(() => {
    const loader = load();
    const text = query();
    attempt();
    if (!loader || !enabled()) {
      setState((previous) => (previous.loading ? { ...previous, loading: false } : previous));
      return;
    }

    let latest = true;
    setState((previous) => ({ ...previous, loading: true, failed: false }));
    const timer = setTimeout(() => {
      new Promise<ReadonlyArray<string | SelectOption>>((resolve) => resolve(loader(text))).then(
        (result) => {
          if (latest) setState({ items: result.map(normalizeOption), loading: false, failed: false });
        },
        () => {
          if (latest) setState({ items: [], loading: false, failed: true });
        },
      );
    }, delayMs);
    onCleanup(() => {
      latest = false;
      clearTimeout(timer);
    });
  });

  return {
    items: () => state().items,
    loading: () => state().loading,
    failed: () => state().failed,
    retry: () => setAttempt((count) => count + 1),
  };
};
