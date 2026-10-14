import { type Accessor, createSignal, type JSX, onCleanup } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { reportAsyncError } from '../../utils/reportAsyncError';
import type { AnalysisRunPayload } from './analysisSources';

export interface AnalysisRunInput {
  status?: 'idle' | 'running';
  error?: JSX.Element;
  onRun?: (payload: AnalysisRunPayload, signal: AbortSignal) => void | Promise<void>;
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
  cancel: () => void;
}

export const createAnalysisRun = (input: AnalysisRunInput, options: AnalysisRunOptions): AnalysisRun => {
  const operation = createOperation();
  const [failed, setFailed] = createSignal(false);
  let controller: AbortController | undefined;
  const cancel = () => {
    controller?.abort();
    operation.invalidate();
    setFailed(false);
  };
  onCleanup(cancel);

  const running = () => input.status === 'running' || operation.busy();
  const shownError = () => input.error || (failed() ? options.runErrorText() : undefined);

  const run = async () => {
    if (options.blocked() || running() || !input.onRun) return;
    const run = operation.begin();
    if (!run) return;
    const request = new AbortController();
    controller = request;
    setFailed(false);
    try {
      await input.onRun(options.payload(), request.signal);
    } catch (error) {
      if (run.isCurrent() && !request.signal.aborted) {
        setFailed(true);
        if (input.onError) input.onError(error);
        else reportAsyncError(error);
      }
    } finally {
      if (controller === request) controller = undefined;
      run.finish();
    }
  };

  return { running, shownError, run, cancel };
};
