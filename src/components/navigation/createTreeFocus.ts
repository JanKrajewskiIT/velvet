import { type Accessor, createSignal, type Setter, untrack } from 'solid-js';

import { createFrameFocus } from '../../hooks/createFrameFocus';
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
  const focusAfterRender = createFrameFocus(() => root);

  const setRoot = (element: HTMLUListElement) => {
    root = element;
  };
  const focusRow = (id: string) => {
    setFocusId(id);
    focusAfterRender(`[role="treeitem"][data-id="${CSS.escape(id)}"]`);
  };

  return { setRoot, setFocusId, tabbableId, focusRow };
};
