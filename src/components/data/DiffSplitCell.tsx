import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import type { DiffRow } from './diffLines';
import { DiffText } from './DiffText';
import { DIFF_SIGN } from './diffView';

export interface DiffSplitCellProps {
  side: 'del' | 'add';
  row: DiffRow | undefined;
}

/** One half of a split-view row; empty when the other side has no counterpart. */
export const DiffSplitCell = (props: DiffSplitCellProps) => {
  const tone = () => `vui-diff__c--${props.side}`;
  return (
    <Show when={props.row} fallback={<span class="vui-diff__empty" />}>
      {(row) => (
        <>
          <span class={cx('vui-diff__ln', tone())}>{props.side === 'del' ? row().o : row().n}</span>
          <span class={cx('vui-diff__sign', tone())}>{DIFF_SIGN[props.side]}</span>
          <span class={cx('vui-diff__code', tone())}>
            <DiffText row={row()} />
          </span>
        </>
      )}
    </Show>
  );
};
