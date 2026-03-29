import type { TreeNode } from './TreeView';

export interface TreeVisibleItem {
  id: string;
  parentId: string | null;
  hasChildren: boolean;
  isExpanded: boolean;
}

export const cloneTreeNodes = (nodes: readonly TreeNode[]): TreeNode[] =>
  nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTreeNodes(node.children) : undefined,
  }));

export const findTreeNodeById = (nodes: readonly TreeNode[], id: string): TreeNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (!node.children?.length) continue;
    const childMatch = findTreeNodeById(node.children, id);
    if (childMatch) return childMatch;
  }
  return undefined;
};

export const collectTreeDescendantIds = (node: TreeNode): string[] => {
  const ids: string[] = [];
  const walk = (current: TreeNode) => {
    ids.push(current.id);
    current.children?.forEach(walk);
  };
  walk(node);
  return ids;
};

export const collectTreeNodeIds = (nodes: readonly TreeNode[]): Set<string> => {
  const ids = new Set<string>();
  const walk = (currentNodes: readonly TreeNode[]) => {
    for (const node of currentNodes) {
      ids.add(node.id);
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return ids;
};

export const removeTreeNodeById = (
  nodes: readonly TreeNode[],
  id: string
): { nodes: TreeNode[]; removed: TreeNode | null } => {
  let removed: TreeNode | null = null;
  const next = nodes
    .map((node) => {
      if (node.id === id) {
        removed = node;
        return null;
      }
      if (!node.children?.length) return node;
      const result = removeTreeNodeById(node.children, id);
      if (result.removed) {
        removed = result.removed;
        return { ...node, children: result.nodes };
      }
      return node;
    })
    .filter(Boolean) as TreeNode[];
  return { nodes: next, removed };
};

export const insertTreeNodeAsChild = (nodes: readonly TreeNode[], targetId: string, child: TreeNode): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === targetId) {
      const children = node.children ? [...node.children, child] : [child];
      return { ...node, hasChildren: true, children };
    }
    if (!node.children?.length) return node;
    return { ...node, children: insertTreeNodeAsChild(node.children, targetId, child) };
  });

export const updateTreeNodeChildren = (
  nodes: readonly TreeNode[],
  targetId: string,
  children: TreeNode[]
): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, hasChildren: children.length > 0, children };
    }
    if (!node.children?.length) return node;
    return { ...node, children: updateTreeNodeChildren(node.children, targetId, children) };
  });

export const buildVisibleTreeItems = (nodes: readonly TreeNode[], expanded: ReadonlySet<string>): TreeVisibleItem[] => {
  const items: TreeVisibleItem[] = [];

  const walk = (currentNodes: readonly TreeNode[], parentId: string | null) => {
    for (const node of currentNodes) {
      const hasChildren = Boolean((node.children?.length ?? 0) > 0 || node.hasChildren);
      const isExpanded = hasChildren && expanded.has(node.id);
      items.push({ id: node.id, parentId, hasChildren, isExpanded });
      if (hasChildren && isExpanded && node.children?.length) {
        walk(node.children, node.id);
      }
    }
  };

  walk(nodes, null);
  return items;
};
