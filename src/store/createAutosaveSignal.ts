import { type Accessor, createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface CreateAutosaveSignalOptions<TData> {
  source: Accessor<TData>;
  save: (data: TData) => Promise<void>;
  delayMs?: number;
  saveFeedbackMs?: number;
}

export interface AutosaveSignal {
  status: Accessor<AutosaveStatus>;
  error: Accessor<Error | undefined>;
  isSaving: Accessor<boolean>;
  flush: () => Promise<void>;
}

export function createAutosaveSignal<TData>(options: CreateAutosaveSignalOptions<TData>): AutosaveSignal {
  const delayMs = options.delayMs ?? 500;
  const saveFeedbackMs = options.saveFeedbackMs ?? 3000;

  const [status, setStatus] = createSignal<AutosaveStatus>('idle');
  const [error, setError] = createSignal<Error | undefined>(undefined);

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let latestSnapshot = options.source();

  const executeSave = async (snapshot: TData): Promise<void> => {
    setStatus('saving');
    setError(undefined);

    try {
      await options.save(snapshot);
      setStatus('saved');

      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }

      feedbackTimer = setTimeout(() => {
        setStatus('idle');
      }, saveFeedbackMs);
    } catch (unknownError) {
      const normalized = unknownError instanceof Error ? unknownError : new Error('Autosave failed');
      setError(normalized);
      setStatus('error');
    }
  };

  const flush = async (): Promise<void> => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }

    latestSnapshot = options.source();
    await executeSave(latestSnapshot);
  };

  createEffect(
    on(
      options.source,
      (snapshot) => {
        latestSnapshot = snapshot;

        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          void executeSave(snapshot);
        }, delayMs);
      },
      { defer: true }
    )
  );

  onCleanup(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }
  });

  const isSaving = createMemo(() => {
    const currentStatus = status();
    return currentStatus === 'saving';
  });

  return {
    status,
    error,
    isSaving,
    flush,
  };
}
