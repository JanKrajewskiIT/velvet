import { type Accessor, createMemo } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { createTreeLoading } from './createTreeLoading';
import { flattenTree, hasChildren, leavesOf, reuseRows, type TreeNode, type TreeRow } from './treeData';
import type { TreeViewConfig } from './treeViewTypes';

export interface TreeModel {
  selected: Accessor<string | null>;
  open: Accessor<ReadonlySet<string>>;
  checkedSet: Accessor<ReadonlySet<string>>;
  rows: Accessor<TreeRow[]>;
  loadChildren: (node: TreeNode) => Promise<void>;
  setNodeOpen: (node: TreeNode, want: boolean, loadChildren?: boolean) => void;
  toggleNode: (node: TreeNode) => void;
  expandSiblingsOf: (row: TreeRow) => void;
  toggleCheck: (node: TreeNode) => void;
  choose: (node: TreeNode) => void;
}

/** Selection, expansion, checked leaves, lazy loading and the visible rows of the TreeView. */
export const createTreeModel = (config: TreeViewConfig): TreeModel => {
  const [selected, setSelected] = createControllable<string | null>({
    value: () => config.selected,
    defaultValue: config.defaultSelected ?? null,
  });
  const [expanded, setExpanded] = createControllable<string[]>({
    value: () => config.expanded,
    defaultValue: config.defaultExpanded,
    onChange: (ids) => config.onExpandedChange?.(ids),
  });
  const [checked, setChecked] = createControllable<string[]>({
    value: () => config.checked,
    defaultValue: config.defaultChecked,
    onChange: (ids) => config.onCheckedChange?.(ids),
  });
  const open = createMemo(() => new Set(expanded()));
  const checkedSet = createMemo(() => new Set(checked()));
  const { load, loadChildren } = createTreeLoading(config);
  const rows = createMemo<TreeRow[]>((previous = []) => reuseRows(previous, flattenTree(config.data, open(), load())));

  const setNodeOpen = (node: TreeNode, want: boolean, shouldLoadChildren = true) => {
    const next = new Set(open());
    if (want) next.add(node.id);
    else next.delete(node.id);
    setExpanded([...next]);
    if (shouldLoadChildren && want && node.lazy && !hasChildren(node)) void loadChildren(node).catch(reportAsyncError);
  };
  const toggleNode = (node: TreeNode) => setNodeOpen(node, !open().has(node.id));
  const expandSiblingsOf = (row: TreeRow) => {
    const next = new Set(open());
    for (const sibling of rows())
      if (sibling.kind === 'node' && sibling.parent === row.parent && hasChildren(sibling.node)) next.add(sibling.id);
    setExpanded([...next]);
  };

  const toggleCheck = (node: TreeNode) => {
    const leaves = leavesOf(node);
    const next = new Set(checkedSet());
    const all = leaves.every((id) => next.has(id));
    for (const id of leaves) {
      if (all) next.delete(id);
      else next.add(id);
    }
    setChecked([...next]);
  };
  const choose = (node: TreeNode) => {
    setSelected(node.id);
    config.onSelect?.(node.id, node);
  };

  return {
    selected,
    open,
    checkedSet,
    rows,
    loadChildren,
    setNodeOpen,
    toggleNode,
    expandSiblingsOf,
    toggleCheck,
    choose,
  };
};
