import { Index, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Checkmark } from '../primitives/Checkmark';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import type { TreeController } from './treeController';
import { checkStateOf, isBranch, type NodeRow } from './treeData';
import { canNestIn, type TreeMovePosition } from './treeMoves';
import styles from './TreeNodeRow.module.css';

const TREE_PART_ROW_VARIANT_CLASSES = {
  inside: styles.treePartRowVariantDropInside,
  before: styles.treePartRowVariantDropBefore,
  after: styles.treePartRowVariantDropAfter,
} as const;

export interface TreeNodeRowProps {
  tree: TreeController;
  row: NodeRow;
}

const GUIDE_BASE_PX = 17;
const GUIDE_STEP_PX = 20;

/** One `treeitem` row of the TreeView: guides, caret, optional checkbox, icon, label, meta. */
export const TreeNodeRow = (props: TreeNodeRowProps) => {
  const node = () => props.row.node;
  const branch = () => isBranch(node());
  const isOpen = () => branch() && props.tree.model.open().has(node().id);
  const checkState = () => checkStateOf(node(), props.tree.model.checkedSet());
  const dropPosition = (event: DragEvent & { currentTarget: HTMLLIElement }): TreeMovePosition => {
    if (!props.tree.config.onMovePosition) return 'inside';
    const bounds = event.currentTarget.getBoundingClientRect();
    const y = (event.clientY - bounds.top) / bounds.height;
    return canNestIn(node()) && y > 0.28 && y < 0.72 ? 'inside' : y < 0.5 ? 'before' : 'after';
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- rows use roving tabindex and the tree owner handles keyboard activation (Enter/Space)
    <li
      data-id={props.row.id}
      role="treeitem"
      aria-level={props.row.level}
      aria-setsize={props.row.size}
      aria-posinset={props.row.pos}
      aria-expanded={branch() ? isOpen() : undefined}
      aria-selected={props.tree.config.checkable ? undefined : props.tree.model.selected() === node().id}
      aria-checked={
        props.tree.config.checkable ? (checkState() === 'mixed' ? 'mixed' : checkState() === 'on') : undefined
      }
      tabIndex={props.tree.focus.tabbableId() === props.row.id ? 0 : -1}
      draggable={props.tree.move.enabled()}
      class={cx(
        styles.treePartRow,
        props.tree.model.selected() === node().id && styles.treePartRowVariantSel,
        props.tree.move.sourceId() === node().id && styles.treePartRowVariantDragging,
        props.tree.move.targetId() === node().id &&
          variantClass(TREE_PART_ROW_VARIANT_CLASSES, props.tree.move.position()),
      )}
      style={{ '--lvl': props.row.level - 1 }}
      onClick={() => {
        props.tree.focus.setFocusId(props.row.id);
        if (props.tree.config.checkable) {
          if (branch()) props.tree.model.toggleNode(node());
          else props.tree.model.toggleCheck(node());
          return;
        }
        props.tree.model.choose(node());
        if (branch()) props.tree.model.toggleNode(node());
      }}
      onFocusIn={() => props.tree.focus.setFocusId(props.row.id)}
      onDragStart={(event) => {
        if (!props.tree.move.enabled()) return;
        event.dataTransfer?.setData('text/plain', node().id);
        if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        props.tree.move.start(node().id, 'pointer');
      }}
      onDragOver={(event) => {
        const position = dropPosition(event);
        if (!props.tree.move.canDrop(node().id, position)) {
          props.tree.move.setTarget(null);
          return;
        }
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
        props.tree.move.setTarget(node().id, position);
      }}
      onDragLeave={() => {
        if (props.tree.move.targetId() === node().id) props.tree.move.setTarget(null);
      }}
      onDrop={(event) => {
        const position = dropPosition(event);
        if (!props.tree.move.canDrop(node().id, position)) return;
        event.preventDefault();
        props.tree.move.drop(node().id, position);
      }}
      onDragEnd={() => {
        if (props.tree.move.sourceId() === node().id && !props.tree.move.keyboard()) props.tree.move.cancel();
      }}
    >
      <Index each={Array.from({ length: props.row.level - 1 })}>
        {(_, k) => (
          <span
            class={styles.treePartGuide}
            style={{ left: `${GUIDE_BASE_PX + k * GUIDE_STEP_PX}px` }}
            aria-hidden="true"
          />
        )}
      </Index>
      <span
        class={cx(styles.treePartCaret, isOpen() && 'vui-tree__caret--open', !branch() && 'vui-tree__caret--leaf')}
        aria-hidden="true"
      >
        <Show when={branch()}>
          <Chevron direction="right" open={isOpen()} />
        </Show>
      </span>
      <Show when={props.tree.config.checkable}>
        <Checkmark
          size="sm"
          class={styles.treePartCheck}
          checked={checkState() === 'on'}
          indeterminate={checkState() === 'mixed'}
          onClick={(e) => {
            e.stopPropagation();
            props.tree.focus.setFocusId(props.row.id);
            props.tree.model.toggleCheck(node());
          }}
        />
      </Show>
      <Show when={!props.tree.config.checkable || node().icon}>
        <Glyph name={node().icon ?? (branch() ? 'folder' : 'file')} class={styles.treePartIcon} />
      </Show>
      <Text as="span" variant="body-sm" tone="inherit" class={styles.treePartLabel}>
        {node().label}
      </Text>
      <Show when={node().meta != null}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.treePartMeta}>
          {node().meta}
        </Text>
      </Show>
    </li>
  );
};
