import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './CandleChartAxes.module.css';
import type { CandleDatum } from './candleData';
import type { createCandleGeometry } from './createCandleGeometry';
import { LINE_PAD } from './createLineGeometry';

export interface CandleChartAxesProps {
  geometry: ReturnType<typeof createCandleGeometry>;
  candles: readonly CandleDatum[];
  width: number;
  height: number;
  hover: number;
  format: (value: number) => string;
}

export const CandleChartAxes = (props: CandleChartAxesProps) => (
  <>
    <For each={props.geometry.ticks()}>
      {(t) => (
        <g>
          <line
            x1={LINE_PAD.l}
            x2={props.width - LINE_PAD.r}
            y1={props.geometry.y(t)}
            y2={props.geometry.y(t)}
            class={styles.grid}
          />
          <text x={LINE_PAD.l - 8} y={props.geometry.y(t)} dy="0.32em" text-anchor="end" class={styles.tick}>
            {props.format(t)}
          </text>
        </g>
      )}
    </For>
    <For each={props.candles}>
      {(datum, i) => (
        <Show when={i() % props.geometry.labelEvery() === 0}>
          <text
            x={props.geometry.x(i())}
            y={props.height - 8}
            text-anchor="middle"
            class={cx(styles.tick, props.hover === i() && styles.tickOn)}
          >
            {datum.label}
          </text>
        </Show>
      )}
    </For>
  </>
);
