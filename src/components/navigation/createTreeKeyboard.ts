import type { TreeController } from './treeController';
import { isBranch } from './treeData';

/** WAI-ARIA tree keyboard handler for the roving-tabindex rows. */
export const createTreeKeyboard = (tree: TreeController) => (e: KeyboardEvent) => {
  const { config, model, focus } = tree;
  const list = model.rows();
  const index = list.findIndex((row) => row.id === focus.tabbableId());
  const row = list[index];
  if (!row) return;
  const move = (id: string | null | undefined) => {
    if (id == null) return;
    e.preventDefault();
    focus.focusRow(id);
  };
  if (tree.move.keyboard()) {
    switch (e.key) {
      case 'ArrowDown':
        move(list[index + 1]?.id);
        break;
      case 'ArrowUp':
        move(list[index - 1]?.id);
        break;
      case 'Home':
        move(list[0]?.id);
        break;
      case 'End':
        move(list[list.length - 1]?.id);
        break;
      case 'Enter':
      case ' ':
        if (row.kind === 'node') {
          e.preventDefault();
          tree.move.drop(row.id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        tree.move.cancel();
        break;
    }
    return;
  }
  if (row.kind === 'status') {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') move(row.parent);
    else if (e.key === 'ArrowDown') move(list[index + 1]?.id);
    else if ((e.key === 'Enter' || e.key === ' ') && row.status.kind === 'error') {
      e.preventDefault();
      void model.loadChildren(row.owner);
    }
    return;
  }
  const { node } = row;
  if (tree.move.enabled() && e.key === ' ' && (config.checkable ? e.ctrlKey : !e.ctrlKey && !e.altKey && !e.metaKey)) {
    e.preventDefault();
    tree.move.start(node.id, 'keyboard');
    return;
  }
  const branch = isBranch(node);
  const isOpen = model.open().has(node.id);
  switch (e.key) {
    case 'ArrowDown':
      move(list[index + 1]?.id);
      break;
    case 'ArrowUp':
      move(list[index - 1]?.id);
      break;
    case 'Home':
      move(list[0]?.id);
      break;
    case 'End':
      move(list[list.length - 1]?.id);
      break;
    case 'ArrowRight': {
      e.preventDefault();
      const next = list[index + 1];
      if (branch && !isOpen) model.setNodeOpen(node, true);
      else if (branch && next?.parent === node.id) move(next.id);
      break;
    }
    case 'ArrowLeft':
      e.preventDefault();
      if (branch && isOpen) model.setNodeOpen(node, false);
      else move(row.parent);
      break;
    case ' ':
      e.preventDefault();
      if (config.checkable) model.toggleCheck(node);
      else model.choose(node);
      break;
    case 'Enter':
      e.preventDefault();
      model.choose(node);
      break;
    case '*':
      e.preventDefault();
      model.expandSiblingsOf(row);
      break;
  }
};
