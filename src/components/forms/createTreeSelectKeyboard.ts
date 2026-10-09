import type { TreeSelectView } from './createTreeSelectView';
import type { TreeSelectNode } from './treeSelectRows';

/** ↑↓ move the active row, →/← expand and collapse it, Enter picks it. */
export const createTreeSelectKeyboard =
  (view: TreeSelectView, pick: (node: TreeSelectNode, hasChildren: boolean) => void) => (e: KeyboardEvent) => {
    const row = view.activeRow();
    const canExpand = !!row?.hasChildren && !view.needle();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      view.setActive(Math.min(view.rows().length - 1, view.active() + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      view.setActive(Math.max(0, view.active() - 1));
    } else if (e.key === 'ArrowRight' && row && canExpand) {
      e.preventDefault();
      view.toggleExpanded(row.node.id, true);
    } else if (e.key === 'ArrowLeft' && row && canExpand) {
      e.preventDefault();
      view.toggleExpanded(row.node.id, false);
    } else if (e.key === 'Enter' && row) {
      e.preventDefault();
      pick(row.node, row.hasChildren);
    }
  };
