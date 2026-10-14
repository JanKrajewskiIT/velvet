import type { TreeNode } from './treeData';

const TREE_MOVE_POSITIONS = ['before', 'after', 'inside'] as const;
export type TreeMovePosition = (typeof TREE_MOVE_POSITIONS)[number];
export interface TreeMove {
  id: string;
  targetId: string;
  position: TreeMovePosition;
}

export interface TreeEntry {
  node: TreeNode;
  parent: string | null;
  siblings: TreeNode[];
  index: number;
}

export const indexTree = (
  nodes: TreeNode[],
  parent: string | null = null,
  map = new Map<string, TreeEntry>(),
): Map<string, TreeEntry> => {
  nodes.forEach((node, index) => {
    map.set(node.id, { node, parent, siblings: nodes, index });
    if (node.children) indexTree(node.children, node.id, map);
  });
  return map;
};

export const canNestIn = (node: TreeNode): boolean => Array.isArray(node.children) || !!node.lazy;

export const isWithinTree = (map: ReadonlyMap<string, TreeEntry>, id: string, ancestor: string): boolean => {
  for (let current: string | null = id; current !== null; current = map.get(current)?.parent ?? null) {
    if (current === ancestor) return true;
  }
  return false;
};

/** Invalid targets leave the tree intact, including attempts to move a branch into its descendants. */
export const moveTreeNode = (data: TreeNode[], move: TreeMove): TreeNode[] => {
  const map = indexTree(data);
  const source = map.get(move.id);
  const target = map.get(move.targetId);
  if (
    !source ||
    !target ||
    !TREE_MOVE_POSITIONS.includes(move.position) ||
    isWithinTree(map, move.targetId, move.id) ||
    (move.position === 'inside' && !canNestIn(target.node))
  )
    return data;
  const strip = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .filter((node) => node.id !== move.id)
      .map((node) => (node.children ? { ...node, children: strip(node.children) } : node));
  const insert = (nodes: TreeNode[]): TreeNode[] => {
    const index = nodes.findIndex((node) => node.id === move.targetId);
    if (index >= 0) {
      if (move.position === 'inside')
        return nodes.map((node) =>
          node.id === move.targetId ? { ...node, children: [...(node.children ?? []), source.node] } : node,
        );
      const result = [...nodes];
      result.splice(move.position === 'before' ? index : index + 1, 0, source.node);
      return result;
    }
    return nodes.map((node) => (node.children ? { ...node, children: insert(node.children) } : node));
  };
  return insert(strip(data));
};
