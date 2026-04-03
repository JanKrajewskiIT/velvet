import { IoChevronForward } from 'solid-icons/io';
import { For, type JSX, Show } from 'solid-js';

import Checkbox from '~/components/switchers/Checkbox/Checkbox';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { TreeNode } from '../TreeView';
import styles from './TreeItem.module.css';

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
    parentId: string | null,
  ) => void;
  onToggle: (id: string) => void;
  onDragStart: (id: string, event: DragEvent) => void;
  onDragOver: (id: string, event: DragEvent) => void;
  onDrop: (id: string, event: DragEvent) => void;
  onDragLeave: () => void;
  onSelect?: (id: string) => void;
  toggleNodeLabel?: (label: string) => string;
}

const TreeItem = (props: Props<TreeItemProps>) => {
  const { ts } = useI18n();
  const hasChildren = () => Boolean((props.node.children && props.node.children.length > 0) || props.node.hasChildren);
  const isExpanded = () => props.expanded.has(props.node.id);
  const isSelected = () => props.selectedId === props.node.id;
  const isChecked = () => props.checkedSet.has(props.node.id);
  const toggleLabel = () =>
    props.toggleNodeLabel?.(props.node.label) ?? ts('tree.toggleNode', { label: props.node.label });
  const loadingLabel = () => ts('tree.loading');

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
          props.dragOverId === props.node.id && styles.dragOver,
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
          <Checkbox
            class={styles.checkbox}
            checked={isChecked()}
            onClick={handleCheckboxClick}
            onKeyDown={handleCheckboxKeyDown}
            aria-label={toggleLabel()}
          />
        </Show>
        <Show when={hasChildren()} fallback={<span class={styles.chevronPlaceholder} />}>
          <span class={classNames(styles.chevron, isExpanded() && styles.chevronExpanded)}>
            <IoChevronForward />
          </span>
        </Show>
        <Show when={props.node.icon}>
          <span class={styles.icon}>{props.node.icon}</span>
        </Show>
        <Text as="span" variant="bodySm" tone="muted">
          {props.node.label}
        </Text>
      </div>
      <Show when={hasChildren()}>
        <div class={classNames(styles.children, isExpanded() && styles.childrenExpanded)}>
          <Show when={!props.isLoading} fallback={<div class={styles.loading}>{loadingLabel()}</div>}>
            <ul class={classNames(styles.tree, styles.childrenInner)} role="group">
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
                    onDragLeave={props.onDragLeave}
                    onSelect={props.onSelect}
                    toggleNodeLabel={props.toggleNodeLabel}
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

export default TreeItem;
