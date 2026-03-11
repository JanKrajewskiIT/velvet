import { IoChevronForward } from 'solid-icons/io';
import { createSignal, For, type JSX, Show } from 'solid-js';

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
  onToggle: (id: string) => void;
  onSelect?: (id: string) => void;
}

const TreeItem = (props: TreeItemProps) => {
  const hasChildren = () => props.node.children && props.node.children.length > 0;
  const isExpanded = () => props.expanded.has(props.node.id);
  const isSelected = () => props.selectedId === props.node.id;

  const handleClick = () => {
    if (hasChildren()) {
      props.onToggle(props.node.id);
    }
    props.onSelect?.(props.node.id);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
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
        tabIndex={0}
        aria-expanded={hasChildren() ? isExpanded() : undefined}
        aria-selected={isSelected()}
        onClick={handleClick}
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

  return (
    <ul class={`${styles.tree} ${props.class ?? ''}`} role="tree">
      <For each={props.nodes}>
        {(node) => (
          <TreeItem
            node={node}
            expanded={expanded()}
            selectedId={props.selectedId}
            onToggle={handleToggle}
            onSelect={props.onSelect}
          />
        )}
      </For>
    </ul>
  );
};

export default TreeView;
