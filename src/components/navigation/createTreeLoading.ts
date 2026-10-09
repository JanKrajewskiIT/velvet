import { type Accessor, createSignal } from 'solid-js';

import { type LoadStatuses, omitKey, type TreeNode } from './treeData';
import type { TreeViewProps } from './treeViewTypes';

export interface TreeLoading {
  load: Accessor<LoadStatuses>;
  loadChildren: (node: TreeNode) => Promise<void>;
}

export const createTreeLoading = (props: Pick<TreeViewProps, 'onLoadChildren' | 'onLoadError'>): TreeLoading => {
  const [load, setLoad] = createSignal<LoadStatuses>({});

  const loadChildren = async (node: TreeNode) => {
    if (!props.onLoadChildren || load()[node.id]?.kind === 'loading') return;
    setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'loading' } }));
    try {
      await props.onLoadChildren(node);
      setLoad((statuses) => omitKey(statuses, node.id));
    } catch (error) {
      setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'error' } }));
      props.onLoadError?.(node, error);
    }
  };

  return { load, loadChildren };
};
