import { IoChevronForward } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './TreeView.module.css';

export interface TreeNode {
  id: string;
  label: string;
  icon?: JSX.Element;
  children?: TreeNode[];
}

interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

interface TreeItemProps {
  node: TreeNode;
  expanded: Set<string>;
  selectedId?: string;
  focusedId: string;
  depth: number;
  parentId: string | null;
  onFocusNode: (id: string) => void;
  onNavigate: (
    id: string,
    e: KeyboardEvent,
    hasChildren: boolean,
    isExpanded: boolean,
    parentId: string | null
  ) => void;
  onToggle: (id: string) => void;
  onSelect?: (id: string) => void;
}

const TreeItem = (props: TreeItemProps) => {
  const hasChildren = () => Boolean(props.node.children && props.node.children.length > 0);
  const isExpanded = () => props.expanded.has(props.node.id);
  const isSelected = () => props.selectedId === props.node.id;

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

  return (
    <li class={styles.node}>
      <div
        class={`${styles.row} ${isSelected() ? styles.selected : ''}`}
        role="treeitem"
        tabIndex={props.focusedId === props.node.id ? 0 : -1}
        aria-expanded={hasChildren() ? isExpanded() : undefined}
        aria-selected={isSelected()}
        aria-level={props.depth + 1}
        data-tree-id={props.node.id}
        onClick={handleClick}
        onFocus={() => props.onFocusNode(props.node.id)}
        onKeyDown={handleKeyDown}
      >
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
          <ul class={`${styles.tree} ${styles.childrenInner}`} role="group">
            <For each={props.node.children}>
              {(child) => (
                <TreeItem
                  node={child}
                  expanded={props.expanded}
                  selectedId={props.selectedId}
                  focusedId={props.focusedId}
                  depth={props.depth + 1}
                  parentId={props.node.id}
                  onFocusNode={props.onFocusNode}
                  onNavigate={props.onNavigate}
                  onToggle={props.onToggle}
                  onSelect={props.onSelect}
                />
              )}
            </For>
          </ul>
        </div>
      </Show>
    </li>
  );
};

const TreeView = (props: Props<TreeViewProps>) => {
  const [expanded, setExpanded] = createSignal<Set<string>>(new Set(props.defaultExpanded ?? []));
  let treeRef: HTMLUListElement | undefined;

  const visibleNodes = createMemo(() => {
    const items: Array<{ id: string; parentId: string | null; hasChildren: boolean; isExpanded: boolean }> = [];

    const walk = (nodes: TreeNode[], parentId: string | null) => {
      for (const node of nodes) {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = hasChildren && expanded().has(node.id);
        items.push({ id: node.id, parentId, hasChildren, isExpanded });
        if (hasChildren && isExpanded) {
          walk(node.children ?? [], node.id);
        }
      }
    };

    walk(props.nodes, null);
    return items;
  });

  const [focusedId, setFocusedId] = createSignal('');

  const handleToggle = (id: string) => {
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

  createEffect(() => {
    const visible = visibleNodes();
    if (visible.length === 0) return;
    if (!visible.some((item) => item.id === focusedId())) {
      const firstVisibleId = visible[0]?.id ?? '';
      setFocusedId(
        props.selectedId && visible.some((item) => item.id === props.selectedId) ? props.selectedId : firstVisibleId
      );
    }
  });

  return (
    <ul ref={treeRef} class={`${styles.tree} ${props.class ?? ''}`} role="tree">
      <For each={props.nodes}>
        {(node) => (
          <TreeItem
            node={node}
            expanded={expanded()}
            selectedId={props.selectedId}
            focusedId={focusedId()}
            depth={0}
            parentId={null}
            onFocusNode={handleFocusNode}
            onNavigate={handleNavigate}
            onToggle={handleToggle}
            onSelect={props.onSelect}
          />
        )}
      </For>
    </ul>
  );
};

export default TreeView;
