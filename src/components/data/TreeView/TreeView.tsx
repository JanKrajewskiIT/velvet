import { createEffect, createMemo, createSignal, For, type JSX, splitProps, untrack } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import TreeItem from './TreeItem/TreeItem';
import styles from './TreeView.module.css';
import {
  buildVisibleTreeItems,
  cloneTreeNodes,
  collectTreeDescendantIds,
  collectTreeNodeIds,
  findTreeNodeById,
  insertTreeNodeAsChild,
  removeTreeNodeById,
  updateTreeNodeChildren,
} from './TreeView.utils';

export interface TreeNode {
  id: string;
  label: string;
  icon?: JSX.Element;
  hasChildren?: boolean;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: readonly TreeNode[];
  defaultExpanded?: readonly string[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  checkable?: boolean;
  checkedIds?: readonly string[];
  defaultChecked?: readonly string[];
  onCheckedIdsChange?: (ids: string[]) => void;
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  draggable?: boolean;
  onMove?: (draggedId: string, targetId: string) => void;
  toggleNodeLabel?: (label: string) => string;
}

const TreeView = (props: Props<TreeViewProps>) => {
  const [local, listProps] = splitProps(props, [
    'nodes',
    'defaultExpanded',
    'onSelect',
    'selectedId',
    'checkable',
    'checkedIds',
    'defaultChecked',
    'onCheckedIdsChange',
    'loadChildren',
    'draggable',
    'onMove',
    'toggleNodeLabel',
    'class',
  ]);
  const [treeData, setTreeData] = createSignal(untrack(() => cloneTreeNodes(local.nodes)));
  const [expanded, setExpanded] = createSignal(new Set(local.defaultExpanded ?? []));
  const [loadingIds, setLoadingIds] = createSignal(new Set<string>());
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dragOverId, setDragOverId] = createSignal<string | null>(null);
  const [internalCheckedIds, setInternalCheckedIds] = createSignal<string[]>([...(local.defaultChecked ?? [])]);
  const [focusedId, setFocusedId] = createSignal('');
  let treeRef: HTMLUListElement | undefined;

  const checkedSet = createMemo(() => new Set(local.checkedIds ?? internalCheckedIds()));
  const visibleNodes = createMemo(() => buildVisibleTreeItems(treeData(), expanded()));

  createEffect(() => {
    setTreeData(cloneTreeNodes(local.nodes));
  });

  createEffect(() => {
    const nodeIds = collectTreeNodeIds(treeData());
    setExpanded((current) => new Set(Array.from(current).filter((id) => nodeIds.has(id))));
    setInternalCheckedIds((current) => current.filter((id) => nodeIds.has(id)));
  });

  const updateCheckedIds = (nextIds: string[]) => {
    setInternalCheckedIds(nextIds);
    local.onCheckedIdsChange?.(nextIds);
  };

  const toggleCheck = (id: string) => {
    const node = findTreeNodeById(treeData(), id);
    if (!node) return;
    const targetIds = collectTreeDescendantIds(node);
    const next = new Set(checkedSet());
    const shouldSelect = targetIds.some((entry) => !next.has(entry));

    for (const targetId of targetIds) {
      if (shouldSelect) {
        next.add(targetId);
      } else {
        next.delete(targetId);
      }
    }

    updateCheckedIds(Array.from(next));
  };

  const loadNodeChildren = async (id: string) => {
    if (!local.loadChildren) return;
    const node = findTreeNodeById(treeData(), id);
    if (!node) return;
    const hasLoadedChildren = Boolean(node.children && node.children.length > 0);
    if (hasLoadedChildren) return;
    if (!node.hasChildren && !node.children?.length) return;
    if (loadingIds().has(id)) return;

    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      const children = await local.loadChildren(node);
      setTreeData((prev) => updateTreeNodeChildren(prev, id, children));
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleToggle = (id: string) => {
    const node = findTreeNodeById(treeData(), id);
    if (!expanded().has(id) && node) {
      void loadNodeChildren(id);
    }

    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const focusNode = (id: string) => {
    if (!treeRef) return;
    treeRef.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)?.focus();
  };

  const handleNavigate = (
    id: string,
    event: KeyboardEvent,
    hasChildren: boolean,
    isExpanded: boolean,
    parentId: string | null,
  ) => {
    const currentVisible = visibleNodes();
    const index = currentVisible.findIndex((item) => item.id === id);
    if (index < 0) return;

    const moveTo = (nextId: string | undefined) => {
      if (!nextId) return;
      event.preventDefault();
      setFocusedId(nextId);
      requestAnimationFrame(() => focusNode(nextId));
    };

    if (event.key === 'ArrowDown') {
      moveTo(currentVisible[index + 1]?.id);
      return;
    }
    if (event.key === 'ArrowUp') {
      moveTo(currentVisible[index - 1]?.id);
      return;
    }
    if (event.key === 'Home') {
      moveTo(currentVisible[0]?.id);
      return;
    }
    if (event.key === 'End') {
      moveTo(currentVisible[currentVisible.length - 1]?.id);
      return;
    }
    if (event.key === 'ArrowRight') {
      if (hasChildren && !isExpanded) {
        event.preventDefault();
        handleToggle(id);
        return;
      }
      if (hasChildren && isExpanded) {
        moveTo(currentVisible[index + 1]?.id);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      if (hasChildren && isExpanded) {
        event.preventDefault();
        handleToggle(id);
        return;
      }
      moveTo(parentId ?? undefined);
    }
  };

  const handleDragStart = (id: string, event: DragEvent) => {
    if (!local.draggable) return;
    setDraggingId(id);
    event.dataTransfer?.setData('text/plain', id);
    if (event.currentTarget instanceof Element) {
      event.dataTransfer?.setDragImage(event.currentTarget, 8, 8);
    }
  };

  const handleDragOver = (id: string, event: DragEvent) => {
    if (!local.draggable) return;
    event.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (targetId: string, event: DragEvent) => {
    if (!local.draggable) return;
    event.preventDefault();
    const sourceId = draggingId();
    setDragOverId(null);
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;

    const draggedNode = findTreeNodeById(treeData(), sourceId);
    if (!draggedNode) return;
    if (collectTreeDescendantIds(draggedNode).includes(targetId)) return;

    setTreeData((prev) => {
      const removed = removeTreeNodeById(prev, sourceId);
      if (!removed.removed) return prev;
      return insertTreeNodeAsChild(removed.nodes, targetId, removed.removed);
    });
    local.onMove?.(sourceId, targetId);
    setExpanded((prev) => new Set(prev).add(targetId));
  };

  createEffect(() => {
    const visible = visibleNodes();
    if (visible.length === 0) return;
    if (!visible.some((item) => item.id === focusedId())) {
      const firstVisibleId = visible[0]?.id ?? '';
      const selectedInVisible = local.selectedId != null && visible.some((item) => item.id === local.selectedId);
      setFocusedId(selectedInVisible && local.selectedId != null ? local.selectedId : firstVisibleId);
    }
  });

  return (
    <ul {...listProps} ref={treeRef} class={classNames(styles.tree, local.class)} role="tree">
      <For each={treeData()}>
        {(node) => (
          <TreeItem
            node={node}
            isLoading={loadingIds().has(node.id)}
            checkedSet={checkedSet()}
            checkable={local.checkable ?? false}
            draggable={local.draggable ?? false}
            dragOverId={dragOverId()}
            expanded={expanded()}
            selectedId={local.selectedId}
            focusedId={focusedId()}
            depth={0}
            parentId={null}
            onToggleCheck={toggleCheck}
            onFocusNode={(id) => setFocusedId(id)}
            onNavigate={handleNavigate}
            onToggle={handleToggle}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => setDragOverId(null)}
            onSelect={local.onSelect}
            toggleNodeLabel={local.toggleNodeLabel}
          />
        )}
      </For>
    </ul>
  );
};

export default TreeView;
