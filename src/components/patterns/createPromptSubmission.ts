import { createEffect, createSignal, onCleanup } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { reportAsyncError } from '../../utils/reportAsyncError';
import type { PromptAttachment, PromptSubmissionProps } from './promptSubmissionTypes';

export const createPromptSubmission = (
  props: PromptSubmissionProps,
  text: () => string,
  setText: (value: string) => void,
) => {
  const operation = createOperation({ concurrency: 'single-flight' });
  const [failed, setFailed] = createSignal(false);
  let controller: AbortController | undefined;
  const cancel = () => {
    controller?.abort();
    operation.invalidate();
  };
  onCleanup(cancel);
  createEffect(() => {
    if (props.disabled) cancel();
  });
  const canSend = () =>
    !!props.onSubmit &&
    !props.disabled &&
    !props.loading &&
    !operation.busy() &&
    (text().trim() !== '' || (props.attachments?.length ?? 0) > 0);
  const send = async () => {
    if (!canSend()) return;
    const run = operation.begin();
    if (!run) return;
    const request = new AbortController();
    controller = request;
    const draft = text();
    const attachments: PromptAttachment[] = [...(props.attachments ?? [])];
    setFailed(false);
    try {
      const accepted = await props.onSubmit?.(draft.trim(), attachments, request.signal);
      if (run.isCurrent() && !request.signal.aborted) {
        if (accepted === false) setFailed(true);
        else if (text() === draft) setText('');
      }
    } catch (cause) {
      if (run.isCurrent() && !request.signal.aborted) {
        setFailed(true);
        if (props.onError) props.onError(cause);
        else reportAsyncError(cause);
      }
    } finally {
      if (controller === request) controller = undefined;
      run.finish();
    }
  };
  return { pending: operation.busy, failed, canSend, send, cancel };
};
