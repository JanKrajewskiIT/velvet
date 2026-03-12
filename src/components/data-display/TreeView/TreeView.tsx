import { IoChevronForward } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, For, type JSX, Show, untrack } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TreeView.module.css';

export interface TreeNode {
  id: string;
  label: string;
  icon?: JSX.Element;
  hasChildren?: boolean;
  children?: TreeNode[];
}

interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  checkable?: boolean;
  checkedIds?: string[];
  defaultChecked?: string[];
  onCheckedIdsChange?: (ids: string[]) => void;
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  draggable?: boolean;
  onMove?: (draggedId: string, targetId: string) => void;
}

interface TreeItemProps {
  node: TreeNode;
  isLoading: boolean;
  checkedSet: Set<string>;
  checkable: boolean;
  draggable: boolean;
  dragOverId: string | null;
  expanded: Set<string>;
  selectedId?: string;
  focusedId: string;
  depth: number;
  parentId: string | null;
  onToggleCheck: (id: string) => void;
  onFocusNode: (id: string) => void;
  onNavigate: (
    id: string,
    e: KeyboardEvent,
    hasChildren: boolean,
    isExpanded: boolean,
    parentId: string | null
  ) => void;
  onToggle: (id: string) => void;
  onDragStart: (id: string, event: DragEvent) => void;
  onDragOver: (id: string, event: DragEvent) => void;
  onDrop: (id: string, event: DragEvent) => void;
  onDragLeave: () => void;
  onSelect?: (id: string) => void;
}

const cloneNodes = (nodes: TreeNode[]): TreeNode[] =>
  nodes.map((node) => ({
    ...node,
    children: node.children ? cloneNodes(node.children) : undefined,
  }));

const findNodeById = (nodes: TreeNode[], id: string): TreeNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (!node.children?.length) continue;
    const childMatch = findNodeById(node.children, id);
    if (childMatch) return childMatch;
  }
  return undefined;
};

const collectDescendantIds = (node: TreeNode): string[] => {
  const ids: string[] = [];
  const walk = (current: TreeNode) => {
    ids.push(current.id);
    current.children?.forEach(walk);
  };
  walk(node);
  return ids;
};

const removeNodeById = (nodes: TreeNode[], id: string): { nodes: TreeNode[]; removed: TreeNode | null } => {
  let removed: TreeNode | null = null;
  const next = nodes
    .map((node) => {
      if (node.id === id) {
        removed = node;
        return null;
      }
      if (!node.children?.length) return node;
      const result = removeNodeById(node.children, id);
      if (result.removed) {
        removed = result.removed;
        return { ...node, children: result.nodes };
      }
      return node;
    })
    .filter(Boolean) as TreeNode[];
  return { nodes: next, removed };
};

const insertNodeAsChild = (nodes: TreeNode[], targetId: string, child: TreeNode): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === targetId) {
      const children = node.children ? [...node.children, child] : [child];
      return { ...node, hasChildren: true, children };
    }
    if (!node.children?.length) return node;
    return { ...node, children: insertNodeAsChild(node.children, targetId, child) };
  });

const updateNodeChildren = (nodes: TreeNode[], targetId: string, children: TreeNode[]): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, hasChildren: children.length > 0, children };
    }
    if (!node.children?.length) return node;
    return { ...node, children: updateNodeChildren(node.children, targetId, children) };
  });

const TreeItem = (props: TreeItemProps) => {
  const hasChildren = () => Boolean((props.node.children && props.node.children.length > 0) || props.node.hasChildren);
  const isExpanded = () => props.expanded.has(props.node.id);
  const isSelected = () => props.selectedId === props.node.id;
  const isChecked = () => props.checkedSet.has(props.node.id);

  const handleClick = () => {
    if (hasChildren()) {
      props.onToggle(props.node.id);
    }
    props.onSelect?.(props.node.id);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    props.onNavigate(props.node.id, e, hasChildren(), isExpanded(), props.parentId);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleCheckboxClick: JSX.EventHandler<HTMLInputElement, MouseEvent> = (e) => {
    e.stopPropagation();
    props.onToggleCheck(props.node.id);
  };

  const handleCheckboxKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    e.stopPropagation();
  };

  const handleDragStart: JSX.EventHandler<HTMLDivElement, DragEvent> = (e) => {
    props.onDragStart(props.node.id, e);
  };

  const handleDragOver: JSX.EventHandler<HTMLDivElement, DragEvent> = (e) => {
    props.onDragOver(props.node.id, e);
  };

  const handleDrop: JSX.EventHandler<HTMLDivElement, DragEvent> = (e) => {
    props.onDrop(props.node.id, e);
  };

  return (
    <li class={styles.node}>
      <div
        class={classNames(
          styles.row,
          isSelected() && styles.selected,
          props.dragOverId === props.node.id && styles.dragOver
        )}
        role="treeitem"
        tabIndex={props.focusedId === props.node.id ? 0 : -1}
        aria-expanded={hasChildren() ? isExpanded() : undefined}
        aria-selected={isSelected()}
        aria-level={props.depth + 1}
        data-tree-id={props.node.id}
        draggable={props.draggable}
        onClick={handleClick}
        onFocus={() => props.onFocusNode(props.node.id)}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => props.onDragLeave()}
      >
        <Show when={props.checkable}>
          <input
            type="checkbox"
            class={styles.checkbox}
            checked={isChecked()}
            onClick={handleCheckboxClick}
            onKeyDown={handleCheckboxKeyDown}
            aria-label={`Toggle ${props.node.label}`}
          />
        </Show>
        <Show when={hasChildren()} fallback={<span class={styles.chevronPlaceholder} />}>
          <span class={`${styles.chevron} ${isExpanded() ? styles.chevronExpanded : ''}`}>
            <IoChevronForward />
          </span>
        </Show>
        <Show when={props.node.icon}>
          <span class={styles.icon}>{props.node.icon}</span>
        </Show>
        <span class={styles.label}>{props.node.label}</span>
      </div>
      <Show when={hasChildren()}>
        <div class={`${styles.children} ${isExpanded() ? styles.childrenExpanded : ''}`}>
          <Show when={!props.isLoading} fallback={<div class={styles.loading}>Loading...</div>}>
            <ul class={`${styles.tree} ${styles.childrenInner}`} role="group">
              <For each={props.node.children}>
                {(child) => (
                  <TreeItem
                    node={child}
                    isLoading={props.isLoading}
                    checkedSet={props.checkedSet}
                    checkable={props.checkable}
                    draggable={props.draggable}
                    dragOverId={props.dragOverId}
                    expanded={props.expanded}
                    selectedId={props.selectedId}
                    focusedId={props.focusedId}
                    depth={props.depth + 1}
                    parentId={props.node.id}
                    onToggleCheck={props.onToggleCheck}
                    onFocusNode={props.onFocusNode}
                    onNavigate={props.onNavigate}
                    onToggle={props.onToggle}
                    onDragStart={props.onDragStart}
                    onDragOver={props.onDragOver}
                    onDrop={props.onDrop}
                    onDragLeave={() => props.onDragLeave()}
                    onSelect={props.onSelect}
                  />
                )}
              </For>
            </ul>
          </Show>
        </div>
      </Show>
    </li>
  );
};

const TreeView = (props: Props<TreeViewProps>) => {
  const [treeData, setTreeData] = createSignal<TreeNode[]>(untrack(() => cloneNodes(props.nodes)));
  const [expanded, setExpanded] = createSignal<Set<string>>(new Set(props.defaultExpanded ?? []));
  const [loadingIds, setLoadingIds] = createSignal<Set<string>>(new Set());
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dragOverId, setDragOverId] = createSignal<string | null>(null);
  const [internalCheckedIds, setInternalCheckedIds] = createSignal<string[]>(props.defaultChecked ?? []);
  let treeRef: HTMLUListElement | undefined;

  const checkedSet = createMemo(() => new Set(props.checkedIds ?? internalCheckedIds()));

  const visibleNodes = createMemo(() => {
    const items: Array<{ id: string; parentId: string | null; hasChildren: boolean; isExpanded: boolean }> = [];

    const walk = (nodes: TreeNode[], parentId: string | null) => {
      for (const node of nodes) {
        const hasChildren = Boolean((node.children?.length ?? 0) > 0 || node.hasChildren);
        const isExpanded = hasChildren && expanded().has(node.id);
        items.push({ id: node.id, parentId, hasChildren, isExpanded });
        if (hasChildren && isExpanded && node.children?.length) {
          walk(node.children, node.id);
        }
      }
    };

    walk(treeData(), null);
    return items;
  });

  const [focusedId, setFocusedId] = createSignal('');

  createEffect(() => {
    setTreeData(cloneNodes(props.nodes));
  });

  const updateCheckedIds = (nextIds: string[]) => {
    setInternalCheckedIds(nextIds);
    props.onCheckedIdsChange?.(nextIds);
  };

  const toggleCheck = (id: string) => {
    const node = findNodeById(treeData(), id);
    if (!node) return;
    const targetIds = collectDescendantIds(node);
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
    if (!props.loadChildren) return;
    const node = findNodeById(treeData(), id);
    if (!node) return;
    const hasLoadedChildren = Boolean(node.children && node.children.length > 0);
    if (hasLoadedChildren) return;
    if (!node.hasChildren && !node.children?.length) return;
    if (loadingIds().has(id)) return;

    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      const children = await props.loadChildren(node);
      setTreeData((prev) => updateNodeChildren(prev, id, children));
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleToggle = (id: string) => {
    const node = findNodeById(treeData(), id);
    const shouldExpand = !expanded().has(id);
    if (shouldExpand && node) {
      void loadNodeChildren(id);
    }

    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const focusNode = (id: string) => {
    if (!treeRef) return;
    const target = treeRef.querySelector<HTMLElement>(`[data-tree-id="${id}"]`);
    target?.focus();
  };

  const handleFocusNode = (id: string) => {
    setFocusedId(id);
  };

  const handleNavigate = (
    id: string,
    e: KeyboardEvent,
    hasChildren: boolean,
    isExpanded: boolean,
    parentId: string | null
  ) => {
    const currentVisible = visibleNodes();
    const index = currentVisible.findIndex((item) => item.id === id);
    if (index < 0) return;

    const moveTo = (nextId: string | undefined) => {
      if (!nextId) return;
      e.preventDefault();
      setFocusedId(nextId);
      requestAnimationFrame(() => focusNode(nextId));
    };

    if (e.key === 'ArrowDown') {
      moveTo(currentVisible[index + 1]?.id);
      return;
    }
    if (e.key === 'ArrowUp') {
      moveTo(currentVisible[index - 1]?.id);
      return;
    }
    if (e.key === 'Home') {
      moveTo(currentVisible[0]?.id);
      return;
    }
    if (e.key === 'End') {
      moveTo(currentVisible[currentVisible.length - 1]?.id);
      return;
    }
    if (e.key === 'ArrowRight') {
      if (hasChildren && !isExpanded) {
        e.preventDefault();
        handleToggle(id);
        return;
      }
      if (hasChildren && isExpanded) {
        moveTo(currentVisible[index + 1]?.id);
      }
      return;
    }
    if (e.key === 'ArrowLeft') {
      if (hasChildren && isExpanded) {
        e.preventDefault();
        handleToggle(id);
        return;
      }
      moveTo(parentId ?? undefined);
    }
  };

  const handleDragStart = (id: string, event: DragEvent) => {
    if (!props.draggable) return;
    setDraggingId(id);
    event.dataTransfer?.setData('text/plain', id);
    if (event.currentTarget instanceof Element) {
      event.dataTransfer?.setDragImage(event.currentTarget, 8, 8);
    }
  };

  const handleDragOver = (id: string, event: DragEvent) => {
    if (!props.draggable) return;
    event.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (targetId: string, event: DragEvent) => {
    if (!props.draggable) return;
    event.preventDefault();
    const sourceId = draggingId();
    setDragOverId(null);
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;

    const draggedNode = findNodeById(treeData(), sourceId);
    if (!draggedNode) return;
    if (collectDescendantIds(draggedNode).includes(targetId)) return;

    setTreeData((prev) => {
      const removed = removeNodeById(prev, sourceId);
      if (!removed.removed) return prev;
      return insertNodeAsChild(removed.nodes, targetId, removed.removed);
    });
    props.onMove?.(sourceId, targetId);
    setExpanded((prev) => new Set(prev).add(targetId));
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  createEffect(() => {
    const visible = visibleNodes();
    if (visible.length === 0) return;
    if (!visible.some((item) => item.id === focusedId())) {
      const firstVisibleId = visible[0]?.id ?? '';
      const selectedInVisible = props.selectedId != null && visible.some((item) => item.id === props.selectedId);
      setFocusedId(selectedInVisible && props.selectedId != null ? props.selectedId : firstVisibleId);
    }
  });

  return (
    <ul ref={treeRef} class={`${styles.tree} ${props.class ?? ''}`} role="tree">
      <For each={treeData()}>
        {(node) => (
          <TreeItem
            node={node}
            isLoading={loadingIds().has(node.id)}
            checkedSet={checkedSet()}
            checkable={props.checkable ?? false}
            draggable={props.draggable ?? false}
            dragOverId={dragOverId()}
            expanded={expanded()}
            selectedId={props.selectedId}
            focusedId={focusedId()}
            depth={0}
            parentId={null}
            onToggleCheck={toggleCheck}
            onFocusNode={handleFocusNode}
            onNavigate={handleNavigate}
            onToggle={handleToggle}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onSelect={props.onSelect}
          />
        )}
      </For>
    </ul>
  );
};

export default TreeView;
