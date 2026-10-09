import { type Accessor, createSignal, type JSX } from 'solid-js';

import type { AnalysisRunPayload } from './analysisSources';

export interface AnalysisRunInput {
  status?: 'idle' | 'running';
  error?: JSX.Element;
  onRun?: (payload: AnalysisRunPayload) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export interface AnalysisRunOptions {
  blocked: Accessor<boolean>;
  payload: Accessor<AnalysisRunPayload>;
  runErrorText: Accessor<string>;
}

export interface AnalysisRun {
  running: Accessor<boolean>;
  shownError: Accessor<JSX.Element>;
  run: () => Promise<void>;
}

export const createAnalysisRun = (input: AnalysisRunInput, options: AnalysisRunOptions): AnalysisRun => {
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);

  const running = () => input.status === 'running' || busy();
  const shownError = () => input.error || (failed() ? options.runErrorText() : undefined);

  const run = async () => {
    if (options.blocked() || running() || !input.onRun) return;
    setFailed(false);
    setBusy(true);
    try {
      await input.onRun(options.payload());
    } catch (error) {
      setFailed(true);
      input.onError?.(error);
    } finally {
      setBusy(false);
    }
  };

  return { running, shownError, run };
};
