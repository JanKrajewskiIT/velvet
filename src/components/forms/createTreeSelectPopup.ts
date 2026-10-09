import { type Accessor, createEffect, on } from 'solid-js';

import type { TreeSelectView } from './createTreeSelectView';

export interface TreeSelectPopup {
  setSearch: (element: HTMLInputElement) => void;
  setTree: (element: HTMLDivElement) => void;
}

/** Focuses the search box (or the tree) on open and keeps the active row inside the scrolled tree. */
export const createTreeSelectPopup = (open: Accessor<boolean>, view: TreeSelectView): TreeSelectPopup => {
  let search: HTMLInputElement | undefined;
  let tree: HTMLDivElement | undefined;

  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      view.reset();
      (search ?? tree)?.focus();
    }),
  );
  createEffect(() => {
    const row = tree?.children[view.active()];
    if (!open() || !tree || !(row instanceof HTMLElement)) return;
    if (row.offsetTop < tree.scrollTop) tree.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > tree.scrollTop + tree.clientHeight)
      tree.scrollTop = row.offsetTop + row.offsetHeight - tree.clientHeight;
  });

  return {
    setSearch: (element) => {
      search = element;
    },
    setTree: (element) => {
      tree = element;
    },
  };
};
