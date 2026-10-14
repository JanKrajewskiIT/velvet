import { type Accessor, createSignal, getOwner, onCleanup } from 'solid-js';

export interface OperationRun {
  isCurrent: () => boolean;
  finish: () => void;
}

export interface Operation {
  busy: Accessor<boolean>;
  begin: () => OperationRun | undefined;
  invalidate: () => void;
}

export interface OperationOptions {
  /** single-flight retains the lock until underlying work settles after local invalidation. */
  concurrency?: 'latest' | 'single-flight';
}

/** Invalidates local completions without cancelling work owned by the consumer. */
export const createOperation = (options: OperationOptions = {}): Operation => {
  if (!getOwner()) throw new Error('createOperation requires a Solid owner.');
  const [busy, setBusy] = createSignal(false);
  let sequence = 0;
  let disposed = false;
  let pending: number | undefined;
  const invalidate = () => {
    sequence += 1;
    if (options.concurrency !== 'single-flight') setBusy(false);
  };
  onCleanup(() => {
    disposed = true;
    invalidate();
    setBusy(false);
  });
  return {
    busy,
    invalidate,
    begin: () => {
      if (disposed || busy()) return undefined;
      const current = ++sequence;
      pending = current;
      setBusy(true);
      const isCurrent = () => !disposed && sequence === current;
      return {
        isCurrent,
        finish: () => {
          if (pending !== current) return;
          pending = undefined;
          if (isCurrent()) sequence += 1;
          if (!disposed) setBusy(false);
        },
      };
    },
  };
};
