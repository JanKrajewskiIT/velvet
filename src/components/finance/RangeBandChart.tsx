import { createMemo, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { positiveNumber } from '../../utils/numericOption';
import { type ChartDatum, chartValueText } from '../charts/chartSeries';
import { createChartFormat } from '../charts/createChartFormat';
import { createLineCursor } from '../charts/createLineCursor';
import { createWidth } from '../charts/createWidth';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { BAND_PAD, createBandGeometry } from './createBandGeometry';
import styles from './RangeBandChart.module.css';
import { RangeBandTooltip } from './RangeBandTooltip';

export interface RangeBandChartProps {
  data: ChartDatum[];
  loKey?: string;
  hiKey?: string;
  midKey?: string;
  valueKey?: string;
  bandLabel?: string;
  midLabel?: string;
  valueLabel?: string;
  height?: number;
  format?: (value: number) => string;
  label?: string;
  class?: string;
}

export const RangeBandChart = (props: RangeBandChartProps) => {
  const merged = mergeProps(
    { loKey: 'lo', hiKey: 'hi', midKey: 'mid', valueKey: 'value', height: 260 } satisfies Partial<RangeBandChartProps>,
    props,
  );
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const { ref, width } = createWidth();
  const height = () => positiveNumber(merged.height, 260);
  const keys = createMemo(() => ({ lo: merged.loKey, hi: merged.hiKey, mid: merged.midKey, value: merged.valueKey }));
  const geometry = createBandGeometry({ data: () => merged.data, keys, width, height });
  const cursor = createLineCursor(geometry, BAND_PAD.l);
  const hovered = () => merged.data[cursor.hover()];
  const labels = createMemo(() => ({
    band: merged.bandLabel ?? translate('velvet.finance.rangeBandChart.band'),
    mid: merged.midLabel ?? translate('velvet.finance.rangeBandChart.median'),
    value: merged.valueLabel ?? translate('velvet.finance.rangeBandChart.actual'),
  }));
  const label = () => merged.label ?? translate('velvet.finance.rangeBandChart.label');
  const valueText = (datum: ChartDatum, key: string) =>
    chartValueText(datum, key, format, translate('velvet.charts.chartSeries.noValue'));
  const announcement = (datum: ChartDatum) =>
    translate('velvet.finance.rangeBandChart.announcement', {
      label: datum.label,
      actualLabel: labels().value,
      actual: valueText(datum, keys().value),
      medianLabel: labels().mid,
      median: valueText(datum, keys().mid),
      bandLabel: labels().band,
      lo: valueText(datum, keys().lo),
      hi: valueText(datum, keys().hi),
    });
  return (
    <div ref={ref} class={cx(typographyClass('body'), styles.chart, merged.class)}>
      <div class={styles.barTop}>
        <div class={styles.legend}>
          <span class={styles.legendItem}>
            <span class={styles.bandSwatch} />
            {labels().band}
          </span>
          <span class={styles.legendItem}>
            <i class={styles.medianSwatch} />
            {labels().mid}
          </span>
          <span class={styles.legendItem}>
            <i class={styles.valueSwatch} />
            {labels().value}
          </span>
          <Show when={geometry.outside().length}>
            <span class={styles.legendItem}>
              <i class={styles.outsideSwatch} />
              {translate('velvet.finance.rangeBandChart.outside', { count: geometry.outside().length })}
            </span>
          </Show>
        </div>
      </div>
      <div class={styles.plot} style={{ height: `${height()}px` }}>
        <svg
          width={width()}
          height={height()}
          role="img"
          tabindex={0}
          aria-label={translate('velvet.finance.rangeBandChart.instructions', {
            label: label(),
            count: geometry.outside().length,
          })}
          onMouseMove={cursor.move}
          onMouseLeave={cursor.clear}
          onKeyDown={cursor.onKeyDown}
          onFocus={cursor.focus}
          onBlur={cursor.clear}
        >
          <For each={geometry.ticks()}>
            {(tick) => (
              <g>
                <line
                  x1={BAND_PAD.l}
                  x2={width() - BAND_PAD.r}
                  y1={geometry.y(tick)}
                  y2={geometry.y(tick)}
                  class={tick === 0 ? styles.zero : styles.grid}
                />
                <text x={BAND_PAD.l - 8} y={geometry.y(tick)} dy="0.32em" text-anchor="end" class={styles.tick}>
                  {format(tick)}
                </text>
              </g>
            )}
          </For>
          <For each={merged.data}>
            {(datum, index) => (
              <Show when={index() % geometry.labelEvery() === 0}>
                <text
                  x={geometry.x(index())}
                  y={height() - 8}
                  text-anchor="middle"
                  class={cx(styles.tick, cursor.hover() === index() && styles.tickOn)}
                >
                  {datum.label}
                </text>
              </Show>
            )}
          </For>
          <path d={geometry.paths().band} class={styles.band} />
          <path d={geometry.paths().hi} class={styles.edge} />
          <path d={geometry.paths().lo} class={styles.edge} />
          <path d={geometry.paths().mid} class={styles.median} />
          <path d={geometry.paths().value} class={styles.value} />
          <For each={geometry.outside()}>
            {(point) => (
              <circle cx={geometry.x(point.index)} cy={geometry.y(point.value)} r="3.5" class={styles.outside} />
            )}
          </For>
          <Show when={hovered()}>
            <line
              x1={geometry.x(cursor.hover())}
              x2={geometry.x(cursor.hover())}
              y1={BAND_PAD.t}
              y2={BAND_PAD.t + geometry.innerHeight()}
              class={styles.cross}
            />
          </Show>
        </svg>
        <Show when={hovered()}>
          {(datum) => (
            <RangeBandTooltip
              datum={datum()}
              keys={keys()}
              labels={labels()}
              format={format}
              left={clamp(geometry.x(cursor.hover()), 80, Math.max(80, width() - 80))}
              top={BAND_PAD.t}
            />
          )}
        </Show>
        <VisuallyHidden role="status">
          <Show when={hovered()}>{(datum) => announcement(datum())}</Show>
        </VisuallyHidden>
      </div>
    </div>
  );
};
