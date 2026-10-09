import { Index, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Checkmark } from '../primitives/Checkmark';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import type { TreeController } from './treeController';
import { checkStateOf, isBranch, type NodeRow } from './treeData';

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
      class={cx('vui-tree__row', props.tree.model.selected() === node().id && 'vui-tree__row--sel')}
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
    >
      <Index each={Array.from({ length: props.row.level - 1 })}>
        {(_, k) => (
          <span class="vui-tree__guide" style={{ left: `${GUIDE_BASE_PX + k * GUIDE_STEP_PX}px` }} aria-hidden="true" />
        )}
      </Index>
      <span
        class={cx('vui-tree__caret', isOpen() && 'vui-tree__caret--open', !branch() && 'vui-tree__caret--leaf')}
        aria-hidden="true"
      >
        <Show when={branch()}>
          <Chevron direction="right" open={isOpen()} />
        </Show>
      </span>
      <Show when={props.tree.config.checkable}>
        <Checkmark
          size="sm"
          class="vui-tree__check"
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
        <Glyph name={node().icon ?? (branch() ? 'folder' : 'file')} class="vui-tree__icon" />
      </Show>
      <span class="vui-tree__label">{node().label}</span>
      <Show when={node().meta != null}>
        <span class="vui-tree__meta">{node().meta}</span>
      </Show>
    </li>
  );
};
