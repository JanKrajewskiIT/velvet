import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { Spinner } from '../feedback/Spinner';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { TreeController } from './treeController';
import type { StatusRow } from './treeData';
import styles from './TreeStatusRow.module.css';

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
    class={cx(
      typographyClass('body-sm'),
      styles.treePartRow,
      styles.treePartRowVariantStatus,
      props.row.status.kind === 'error' && styles.treePartRowVariantError,
    )}
    style={{ '--lvl': props.row.level - 1 }}
    onFocusIn={() => props.tree.focus.setFocusId(props.row.id)}
  >
    <span class={cx(styles.treePartCaret, 'vui-tree__caret--leaf')} aria-hidden="true" />
    <Show
      when={props.row.status.kind === 'error'}
      fallback={
        <>
          <Spinner size="sm" label={props.tree.labels().loading} />
          <Text as="span" variant="body-sm" tone="inherit" class={styles.treePartLabel}>
            {props.tree.labels().loading}
          </Text>
        </>
      }
    >
      <Glyph name="alert-circle" class={styles.treePartIcon} />
      <Text as="span" variant="body-sm" tone="inherit" class={styles.treePartLabel}>
        {props.tree.labels().loadFailed}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        class={styles.treePartRetry}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          void props.tree.model.loadChildren(props.row.owner).catch(reportAsyncError);
        }}
      >
        {props.tree.labels().retry}
      </Button>
    </Show>
  </li>
);
