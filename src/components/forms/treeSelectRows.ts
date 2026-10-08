import type { JSX } from 'solid-js';

export interface TreeSelectNode {
  id: string;
  label: string;
  icon?: string;
  /** Right-aligned meta — count, code. */
  meta?: JSX.Element;
  children?: TreeSelectNode[];
}

export interface TreeRow {
  node: TreeSelectNode;
  level: number;
  hasChildren: boolean;
}

export type SelectionState = 'on' | 'off' | 'mixed';

export const leafIds = (node: TreeSelectNode): string[] =>
  node.children?.length ? node.children.flatMap(leafIds) : [node.id];

export const findNode = (nodes: readonly TreeSelectNode[], id: string): TreeSelectNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = node.children ? findNode(node.children, id) : null;
    if (found) return found;
  }
  return null;
};

/** Rows that are currently visible: expanded branches, or every branch that contains a search match. */
export const visibleRows = (
  nodes: readonly TreeSelectNode[],
  expanded: ReadonlySet<string>,
  query: string,
  level = 1,
): TreeRow[] => {
  const rows: TreeRow[] = [];
  for (const node of nodes) {
    const children = node.children ?? [];
    const matches = !query || node.label.toLowerCase().includes(query);
    const descendants = visibleRows(children, expanded, query, level + 1);
    if (!matches && descendants.length === 0) continue;
    rows.push({ node, level, hasChildren: children.length > 0 });
    if (children.length && (query || expanded.has(node.id))) rows.push(...descendants);
  }
  return rows;
};

/** Single mode: the node itself. Multiple mode: derived from its leaves (parents are tri-state). */
export const selectionState = (
  node: TreeSelectNode,
  selected: ReadonlySet<string>,
  multiple: boolean,
): SelectionState => {
  if (!multiple) return selected.has(node.id) ? 'on' : 'off';
  const leaves = leafIds(node);
  const count = leaves.filter((id) => selected.has(id)).length;
  if (count === 0) return 'off';
  return count === leaves.length ? 'on' : 'mixed';
};
