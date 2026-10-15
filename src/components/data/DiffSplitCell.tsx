import { Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import type { DiffRow } from './diffLines';
import styles from './DiffSplitCell.module.css';
import { DiffText } from './DiffText';
import { DIFF_SIGN } from './diffView';

const DIFF_PART_C_CLASSES = {
  add: styles.diffPartCVariantAdd,
  del: styles.diffPartCVariantDel,
} as const;

export interface DiffSplitCellProps {
  side: 'del' | 'add';
  row: DiffRow | undefined;
}

/** One half of a split-view row; empty when the other side has no counterpart. */
export const DiffSplitCell = (props: DiffSplitCellProps) => {
  const tone = () => variantClass(DIFF_PART_C_CLASSES, props.side);
  return (
    <Show when={props.row} fallback={<span class={styles.diffPartEmpty} data-side={props.side} />}>
      {(row) => (
        <>
          <Text as="span" variant="body" tabular class={cx(styles.diffPartLn, tone())}>
            {props.side === 'del' ? row().o : row().n}
          </Text>
          <span class={cx(styles.diffPartSign, tone())}>{DIFF_SIGN[props.side]}</span>
          <span class={cx(styles.diffPartCode, tone())}>
            <DiffText row={row()} />
          </span>
        </>
      )}
    </Show>
  );
};
