import { createSignal, onCleanup } from 'solid-js';

import { createOperation } from './createOperation';

export type CopyStatus = 'idle' | 'copied' | 'failed';

export const createCopyFeedback = (resetMs: number) => {
  const [status, setStatus] = createSignal<CopyStatus>('idle');
  const operation = createOperation({ concurrency: 'single-flight' });
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(resetTimer));

  const copy = async (text: string, onCopy?: (value: string) => void) => {
    const run = operation.begin();
    if (!run) return;
    let outcome: Exclude<CopyStatus, 'idle'>;
    try {
      await navigator.clipboard.writeText(text);
      outcome = 'copied';
    } catch {
      outcome = 'failed';
    }
    if (!run.isCurrent()) {
      run.finish();
      return;
    }
    run.finish();
    setStatus(outcome);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setStatus('idle'), resetMs);
    if (outcome === 'copied') onCopy?.(text);
  };

  return { status, busy: operation.busy, copy };
};
