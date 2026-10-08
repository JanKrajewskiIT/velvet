import type { JSX } from 'solid-js';

export interface CascaderNode {
  id: string;
  label: JSX.Element;
  icon?: string;
  meta?: JSX.Element;
  disabled?: boolean;
  children?: CascaderNode[];
}

/** Nodes from the root down to the node with `id`, or `null` when it does not exist. */
export const pathTo = (
  nodes: readonly CascaderNode[],
  id: string,
  ancestors: readonly CascaderNode[] = [],
): CascaderNode[] | null => {
  for (const node of nodes) {
    const path = [...ancestors, node];
    if (node.id === id) return path;
    const found = node.children ? pathTo(node.children, id, path) : null;
    if (found) return found;
  }
  return null;
};

/** Every root-to-leaf path. */
export const leafPaths = (nodes: readonly CascaderNode[], ancestors: readonly CascaderNode[] = []): CascaderNode[][] =>
  nodes.flatMap((node) => {
    const path = [...ancestors, node];
    return node.children?.length ? leafPaths(node.children, path) : [path];
  });

export const hasChildren = (node: CascaderNode): boolean => !!node.children?.length;

export const lastOf = <T>(items: readonly T[]): T | undefined => items[items.length - 1];
