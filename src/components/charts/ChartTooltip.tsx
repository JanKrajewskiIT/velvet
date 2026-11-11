import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createRecordKeys } from '../../hooks/createRecordKeys';
import { cssLength } from '../../utils/cssLength';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { typographyClass } from '../primitives/typography';
import { ChartSwatch } from './ChartSwatch';
import styles from './ChartTooltip.module.css';

const DEFAULT_EDGE = 70;
const NO_ROWS: readonly ChartTooltipRow[] = Object.freeze([]);

export interface ChartTooltipRow {
  /** Stable identity when the same series receives a new value. */
  key?: string;
  label: JSX.Element;
  value: JSX.Element;
  color?: string;
  swatch?: 'dot' | 'band';
}

export interface ChartTooltipProps extends HtmlProps<HTMLDivElement, 'title'> {
  x: number | string;
  y: number | string;
  width?: number;
  /** Keep numeric x this far from both plot edges when width is set. @default 70 */
  edge?: number;
  title?: JSX.Element;
  rows?: readonly ChartTooltipRow[];
  /** False hides it from assistive technology when the chart provides values elsewhere. @default true */
  live?: boolean;
}

/** Floating read-out with a title and one row per series. */
export const ChartTooltip = (props: ChartTooltipProps) => {
  const merged = mergeProps(
    { edge: DEFAULT_EDGE, rows: NO_ROWS, live: true } satisfies Partial<ChartTooltipProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['x', 'y', 'width', 'edge', 'title', 'rows', 'live', 'class', 'style']);
  const records = createRecordKeys(
    () => local.rows,
    (row, index) => row.key ?? index,
    'ChartTooltip',
  );
  const left = () =>
    local.width != null && typeof local.x === 'number'
      ? Math.max(local.edge, Math.min(local.width - local.edge, local.x))
      : local.x;
  return (
    <div
      {...rest}
      role={local.live ? 'status' : undefined}
      aria-live={local.live ? 'polite' : undefined}
      aria-hidden={local.live ? undefined : true}
      class={cx(typographyClass('caption'), styles.tip, local.class)}
      style={{ left: cssLength(left()), top: cssLength(local.y), ...local.style }}
    >
      <Show when={local.title != null}>
        <div class={styles.title}>{local.title}</div>
      </Show>
      <For each={records.keys()}>
        {(key) => (
          <Show when={local.rows[records.indexOf(key)]}>
            {(row) => (
              <div class={styles.row}>
                <ChartSwatch color={row().color} swatch={row().swatch} />
                {row().label}
                <b class={styles.value}>{row().value}</b>
              </div>
            )}
          </Show>
        )}
      </For>
    </div>
  );
};
