import type { JSX } from 'solid-js';

export interface TreeNode {
  id: string;
  label: JSX.Element;
  icon?: string;
  /** Right-aligned count/size */
  meta?: JSX.Element;
  children?: TreeNode[];
  /** Has children that load on first expand (via onLoadChildren) */
  lazy?: boolean;
}

export type LoadStatus = { kind: 'loading' } | { kind: 'error' };

export type LoadStatuses = Readonly<Record<string, LoadStatus>>;

export type TreeRow =
  | { kind: 'node'; id: string; node: TreeNode; level: number; parent: string | null; pos: number; size: number }
  | { kind: 'status'; id: string; owner: TreeNode; status: LoadStatus; level: number; parent: string };

export type NodeRow = Extract<TreeRow, { kind: 'node' }>;

export type StatusRow = Extract<TreeRow, { kind: 'status' }>;

export type CheckState = 'off' | 'on' | 'mixed';

export const hasChildren = (node: TreeNode): boolean => (node.children?.length ?? 0) > 0;

/** A node that can expand: it has children now or will load them. */
export const isBranch = (node: TreeNode): boolean => hasChildren(node) || !!node.lazy;

export const leavesOf = (node: TreeNode): string[] =>
  node.children && hasChildren(node) ? node.children.flatMap(leavesOf) : [node.id];

export const checkStateOf = (node: TreeNode, checked: ReadonlySet<string>): CheckState => {
  const leaves = leavesOf(node);
  const count = leaves.filter((id) => checked.has(id)).length;
  if (count === 0) return 'off';
  return count === leaves.length ? 'on' : 'mixed';
};

export const omitKey = <T>(record: Readonly<Record<string, T>>, key: string): Record<string, T> =>
  Object.fromEntries(Object.entries(record).filter(([entryKey]) => entryKey !== key));

/** Visible rows in document order: expanded branches contribute their children, or a loading / error row while lazy children load. */
export const flattenTree = (
  nodes: readonly TreeNode[],
  open: ReadonlySet<string>,
  load: LoadStatuses,
  level = 1,
  parent: string | null = null,
  out: TreeRow[] = [],
): TreeRow[] => {
  nodes.forEach((node, index) => {
    out.push({ kind: 'node', id: node.id, node, level, parent, pos: index + 1, size: nodes.length });
    if (!open.has(node.id)) return;
    const status = load[node.id];
    if (node.children && hasChildren(node)) flattenTree(node.children, open, load, level + 1, node.id, out);
    else if (node.lazy && status)
      out.push({
        kind: 'status',
        id: `${node.id}::${status.kind}`,
        owner: node,
        status,
        level: level + 1,
        parent: node.id,
      });
  });
  return out;
};

const sameRow = (a: TreeRow, b: TreeRow): boolean => {
  if (a.kind === 'node' && b.kind === 'node') {
    return a.node === b.node && a.level === b.level && a.parent === b.parent && a.pos === b.pos && a.size === b.size;
  }
  return (
    a.kind === 'status' &&
    b.kind === 'status' &&
    a.owner === b.owner &&
    a.level === b.level &&
    a.status.kind === b.status.kind
  );
};

/** Keeps the previous row object for every row that did not change, so keyed rendering preserves its DOM (and focus). */
export const reuseRows = (previous: readonly TreeRow[], next: readonly TreeRow[]): TreeRow[] => {
  const byId = new Map(previous.map((row) => [row.id, row]));
  return next.map((row) => {
    const old = byId.get(row.id);
    return old && sameRow(old, row) ? old : row;
  });
};
