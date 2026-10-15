import { For, Index, Show } from 'solid-js';

import { Skeleton } from '../feedback/Skeleton';
import type { TableController } from './tableController';
import styles from './TableSkeletonRows.module.css';

export interface TableSkeletonRowsProps<T extends object> {
  table: TableController<T>;
}

const SKELETON_WIDTHS = [72, 56, 40, 64];

export const TableSkeletonRows = <T extends object>(props: TableSkeletonRowsProps<T>) => (
  <Index each={Array.from({ length: props.table.config.loadingRows })}>
    {(_, i) => (
      <tr class={styles.row}>
        <Show when={props.table.config.selectable}>
          <td>
            <Skeleton width={18} height={18} />
          </td>
        </Show>
        <For each={props.table.config.columns}>
          {(c, j) => (
            <td class={props.table.pins.cellClass(c)}>
              <Skeleton
                width={`${SKELETON_WIDTHS[(i + j()) % SKELETON_WIDTHS.length]}%`}
                style={{ 'margin-left': c.align === 'right' ? 'auto' : '0' }}
              />
            </td>
          )}
        </For>
        <Show when={props.table.config.renderExpanded}>
          <td />
        </Show>
      </tr>
    )}
  </Index>
);
