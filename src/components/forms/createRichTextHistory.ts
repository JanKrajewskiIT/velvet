import { type Accessor, createSignal, onCleanup } from 'solid-js';

import { createRichTextFragment } from './richTextModel';
import { restoreSel, type SavedSelection, saveSel } from './richTextSelection';

const MAX_STEPS = 200;
const COALESCE_MS = 500;

interface Snapshot {
  html: string;
  selection: SavedSelection | null;
}

export interface RichTextHistoryOptions {
  root: () => HTMLElement | undefined;
  /** Called after undo/redo replaced the content. */
  onRestore: () => void;
}

export interface RichTextHistory {
  canUndo: Accessor<boolean>;
  canRedo: Accessor<boolean>;
  /** Snapshot now. */
  record: () => void;
  /** Snapshot after a pause in typing, so one undo step covers a burst of keystrokes. */
  recordSoon: () => void;
  /** Snapshot now if a delayed one is waiting. */
  flush: () => void;
  travel: (step: -1 | 1) => void;
}

/** Snapshot-based undo/redo stack: the editor owns its own history because it rewrites the DOM. */
export const createRichTextHistory = (options: RichTextHistoryOptions): RichTextHistory => {
  const [availability, setAvailability] = createSignal({ canUndo: false, canRedo: false });
  let position = -1;
  let stack: Snapshot[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));

  const moveTo = (index: number) => {
    position = index;
    setAvailability({ canUndo: position > 0, canRedo: position < stack.length - 1 });
  };

  const record = () => {
    clearTimeout(timer);
    timer = undefined;
    const root = options.root();
    if (!root) return;
    const snapshot: Snapshot = { html: root.innerHTML, selection: saveSel(root) };
    const current = stack[position];
    if (current?.html === snapshot.html) {
      if (snapshot.selection) current.selection = snapshot.selection;
      return;
    }
    stack = [...stack.slice(0, position + 1), snapshot].slice(-MAX_STEPS);
    moveTo(stack.length - 1);
  };

  const flush = () => {
    if (timer !== undefined) record();
  };

  const recordSoon = () => {
    clearTimeout(timer);
    timer = setTimeout(record, COALESCE_MS);
  };

  const travel = (step: -1 | 1) => {
    flush();
    const target = position + step;
    const snapshot = stack[target];
    const root = options.root();
    if (!snapshot || !root) return;
    moveTo(target);
    root.replaceChildren(createRichTextFragment(snapshot.html));
    root.focus();
    restoreSel(root, snapshot.selection);
    options.onRestore();
  };

  return {
    canUndo: () => availability().canUndo,
    canRedo: () => availability().canRedo,
    record,
    recordSoon,
    flush,
    travel,
  };
};
