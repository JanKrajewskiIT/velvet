import { type Accessor, createEffect, createMemo, createSignal, onCleanup, untrack } from 'solid-js';

import { type LoadStatuses, omitKey, type TreeNode } from './treeData';
import type { TreeViewProps } from './treeViewTypes';

export interface TreeLoading {
  load: Accessor<LoadStatuses>;
  loadChildren: (node: TreeNode) => Promise<void>;
}

export const createTreeLoading = (
  props: Pick<TreeViewProps, 'data' | 'dataKey' | 'onLoadChildren' | 'onLoadError'>,
): TreeLoading => {
  const [load, setLoad] = createSignal<LoadStatuses>({});
  const pending = new Map<string, { node: TreeNode; controller: AbortController }>();
  let disposed = false;
  let dataKey = untrack(() => props.dataKey);
  let previousNodes = new Map<string, TreeNode>();
  const nodes = createMemo(() => {
    const result = new Map<string, TreeNode>();
    const visit = (items: TreeNode[]) => {
      for (const node of items) {
        result.set(node.id, node);
        if (node.children) visit(node.children);
      }
    };
    visit(props.data);
    return result;
  });
  createEffect(() => {
    const current = nodes();
    const changed = dataKey !== props.dataKey;
    dataKey = props.dataKey;
    for (const [id, run] of pending) {
      if (!changed && current.get(id) === run.node) continue;
      run.controller.abort();
      pending.delete(id);
    }
    const previous = previousNodes;
    previousNodes = current;
    setLoad((statuses) =>
      Object.fromEntries(
        Object.entries(statuses).filter(
          ([id, status]) =>
            !changed &&
            current.has(id) &&
            current.get(id) === previous.get(id) &&
            (status.kind !== 'loading' || pending.has(id)),
        ),
      ),
    );
  });
  onCleanup(() => {
    disposed = true;
    for (const run of pending.values()) run.controller.abort();
    pending.clear();
  });

  const loadChildren = async (node: TreeNode) => {
    if (disposed || !props.onLoadChildren || pending.has(node.id) || nodes().get(node.id) !== node) return;
    const run = { node, controller: new AbortController() };
    pending.set(node.id, run);
    const current = () =>
      !disposed && pending.get(node.id) === run && !run.controller.signal.aborted && nodes().get(node.id) === node;
    setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'loading' } }));
    try {
      await props.onLoadChildren(node, run.controller.signal);
      if (current()) setLoad((statuses) => omitKey(statuses, node.id));
    } catch (error) {
      if (current()) {
        setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'error' } }));
        props.onLoadError?.(node, error);
      }
    } finally {
      if (pending.get(node.id) === run) pending.delete(node.id);
    }
  };

  return { load, loadChildren };
};
