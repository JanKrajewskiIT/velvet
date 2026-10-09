import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import type { TreeController } from './treeController';
import type { StatusRow } from './treeData';

export interface TreeStatusRowProps {
  tree: TreeController;
  row: StatusRow;
}

/** Loading / failed-to-load row shown under a lazy node. */
export const TreeStatusRow = (props: TreeStatusRowProps) => (
  <li
    data-id={props.row.id}
    role="treeitem"
    aria-level={props.row.level}
    aria-selected={false}
    aria-disabled={props.row.status.kind === 'loading' || undefined}
    tabIndex={props.tree.focus.tabbableId() === props.row.id ? 0 : -1}
    class={cx('vui-tree__row', 'vui-tree__row--status', props.row.status.kind === 'error' && 'vui-tree__row--error')}
    style={{ '--lvl': props.row.level - 1 }}
    onFocusIn={() => props.tree.focus.setFocusId(props.row.id)}
  >
    <span class="vui-tree__caret vui-tree__caret--leaf" aria-hidden="true" />
    <Show
      when={props.row.status.kind === 'error'}
      fallback={
        <>
          <Spinner size="sm" label={props.tree.labels().loading} />
          <span class="vui-tree__label">{props.tree.labels().loading}</span>
        </>
      }
    >
      <Glyph name="alert-circle" class="vui-tree__icon" />
      <span class="vui-tree__label">{props.tree.labels().loadFailed}</span>
      <Button
        variant="ghost"
        size="sm"
        class="vui-tree__retry"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          void props.tree.model.loadChildren(props.row.owner);
        }}
      >
        {props.tree.labels().retry}
      </Button>
    </Show>
  </li>
);
