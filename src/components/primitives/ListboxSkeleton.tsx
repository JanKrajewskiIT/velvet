import { createMemo, Index, mergeProps } from 'solid-js';

import { Skeleton } from '../feedback/Skeleton';
import styles from './ListboxSkeleton.module.css';

const DEFAULT_ROWS = 3;
const WIDTHS = [70, 55, 62, 48] as const;

export interface ListboxSkeletonProps {
  /** @default 3 */
  rows?: number;
}

/** Loading placeholders for a list owned by a busy select or combobox. */
export const ListboxSkeleton = (props: ListboxSkeletonProps) => {
  const merged = mergeProps({ rows: DEFAULT_ROWS } satisfies ListboxSkeletonProps, props);
  const widths = createMemo(() => Array.from({ length: merged.rows }, (_, index) => WIDTHS[index % WIDTHS.length]));
  return (
    <Index each={widths()}>
      {(width) => (
        <li class={styles.row} aria-hidden="true">
          <Skeleton width={`${width()}%`} />
        </li>
      )}
    </Index>
  );
};
