import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './CandleChartLayers.module.css';
import { isRising } from './candleData';
import { candleColor, markerColor } from './candleRows';
import type { createCandleGeometry } from './createCandleGeometry';
import { LINE_PAD } from './createLineGeometry';

const MARKER_RADIUS = 5;

export interface CandleChartLayersProps {
  geometry: ReturnType<typeof createCandleGeometry>;
  width: number;
  hollowRising: boolean;
  showGaps: boolean;
  selectedIndex: number | undefined;
}

export const CandleChartLayers = (props: CandleChartLayersProps) => {
  const x = (index: number) => props.geometry.x(index);
  const y = (price: number) => props.geometry.y(price);
  const selected = () => {
    const index = props.selectedIndex;
    return index !== undefined && Number.isInteger(index) && index >= 0 && index <= props.geometry.lastIndex()
      ? index
      : undefined;
  };

  return (
    <>
      <Show when={selected() !== undefined}>
        <rect
          x={x(selected() ?? 0) - props.geometry.slot() / 2}
          y={LINE_PAD.t}
          width={props.geometry.slot()}
          height={props.geometry.baseline() - LINE_PAD.t}
          class={styles.selected}
        />
      </Show>
      <Show when={props.showGaps}>
        <For each={props.geometry.gaps()}>
          {(index) => (
            <line x1={x(index)} x2={x(index)} y1={LINE_PAD.t} y2={props.geometry.baseline()} class={styles.gap} />
          )}
        </For>
      </Show>
      <For each={props.geometry.refs()}>
        {(reference) => (
          <g style={{ '--reference': markerColor(reference.tone) }}>
            <line
              x1={LINE_PAD.l}
              x2={props.width - LINE_PAD.r}
              y1={y(reference.price)}
              y2={y(reference.price)}
              class={styles.reference}
            />
            <text
              x={props.width - LINE_PAD.r - 4}
              y={y(reference.price) - 4}
              text-anchor="end"
              class={styles.referenceLabel}
            >
              {reference.label}
            </text>
          </g>
        )}
      </For>
      <For each={props.geometry.bodies()}>
        {({ index, candle }) => (
          <g style={{ '--candle': candleColor(isRising(candle)) }}>
            <line x1={x(index)} x2={x(index)} y1={y(candle.high)} y2={y(candle.low)} class={styles.wick} />
            <rect
              x={x(index) - props.geometry.bodyWidth() / 2}
              y={y(Math.max(candle.open, candle.close))}
              width={props.geometry.bodyWidth()}
              height={Math.max(1, Math.abs(y(candle.open) - y(candle.close)))}
              class={cx(styles.body, props.hollowRising && isRising(candle) && styles.bodyHollow)}
            />
          </g>
        )}
      </For>
      <For each={props.geometry.lines()}>
        {(line) => <path d={line.path} class={styles.overlay} style={{ stroke: line.color }} />}
      </For>
      <For each={props.geometry.guides()}>
        {(guide) => (
          <line x1={x(guide.index)} x2={x(guide.index)} y1={y(guide.from)} y2={y(guide.to)} class={styles.guide} />
        )}
      </For>
      <For each={props.geometry.pins()}>
        {(marker) => (
          <circle
            cx={x(marker.index)}
            cy={y(marker.price)}
            r={MARKER_RADIUS}
            class={styles.marker}
            style={{ fill: markerColor(marker.tone) }}
          />
        )}
      </For>
    </>
  );
};
