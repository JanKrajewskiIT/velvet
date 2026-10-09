import { type Accessor, createSignal, type Setter, untrack } from 'solid-js';

import type { TreeRow } from './treeData';

export interface TreeFocus {
  setRoot: (element: HTMLUListElement) => void;
  setFocusId: Setter<string | undefined>;
  /** Roving tabindex target: the focused row while it is visible, otherwise the first row. */
  tabbableId: () => string | undefined;
  focusRow: (id: string) => void;
}

export const createTreeFocus = (rows: Accessor<TreeRow[]>, initialId: Accessor<string | undefined>): TreeFocus => {
  const [focusId, setFocusId] = createSignal<string | undefined>(untrack(initialId));
  const tabbableId = () => (rows().some((row) => row.id === focusId()) ? focusId() : rows()[0]?.id);
  let root: HTMLUListElement | undefined;

  const setRoot = (element: HTMLUListElement) => {
    root = element;
  };
  const focusRow = (id: string) => {
    setFocusId(id);
    [...(root?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])].find((el) => el.dataset.id === id)?.focus();
  };

  return { setRoot, setFocusId, tabbableId, focusRow };
};
