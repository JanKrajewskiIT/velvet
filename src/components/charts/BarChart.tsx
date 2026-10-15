import { createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { positiveNumber } from '../../utils/numericOption';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './BarChart.module.css';
import { type ChartDatum, type ChartSeries, chartValueText, colorOf, defaultSeries, valueOf } from './chartSeries';
import { createChartFormat } from './createChartFormat';
import { createWidth } from './createWidth';
import { numericScale } from './numericScale';

const PAD = { l: 40, r: 8, t: 12, b: 28 } as const;
const MAX_GROUP_WIDTH = 56;
const TIP_MARGIN = 70;

export interface BarChartProps {
  /** `[{ label: 'Mon', value: 12 }]` or one key per series. */
  data: ChartDatum[];
  /** @default [{ key: 'value', label: localized "Value" }] */
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  stacked?: boolean;
  /** Axis + tooltip formatter. @default compact numbers in the active locale (1.2K) */
  format?: (v: number) => string;
  /** Accessible name. @default localized "Bar chart" */
  label?: string;
  /** Default: shown for 2+ series. */
  showLegend?: boolean;
  class?: string;
}

/** Vertical bar chart (grouped or stacked). Hover or focus + ←→ to read each group; the tooltip lists every series and is announced. */
export const BarChart = (props: BarChartProps) => {
  const merged = mergeProps({ height: 240, stacked: false } satisfies Partial<BarChartProps>, props);
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const { ref, width } = createWidth();
  const [hover, setHover] = createSignal(-1);
  const height = () => positiveNumber(merged.height, 240);

  const label = () => merged.label ?? translate('velvet.charts.barChart.label');
  const series = createMemo(() => merged.series ?? defaultSeries(translate));
  const innerWidth = () => Math.max(0, width() - PAD.l - PAD.r);
  const innerHeight = () => Math.max(0, height() - PAD.t - PAD.b);
  const lastIndex = () => merged.data.length - 1;

  const scale = createMemo(() => {
    const totals = merged.data.flatMap((datum) => {
      const values = series().flatMap((entry) => {
        const value = valueOf(datum, entry.key);
        return value === undefined ? [] : [value];
      });
      if (!merged.stacked) return values;
      const positive = values.filter((value) => value >= 0).reduce((sum, value) => sum + value, 0);
      const negative = values.filter((value) => value < 0).reduce((sum, value) => sum + value, 0);
      if (!Number.isFinite(positive) || !Number.isFinite(negative))
        throw new RangeError('Stacked chart totals must be finite.');
      return [positive, negative];
    });
    return numericScale(totals);
  });
  const ticks = () => scale().ticks;
  const y = (v: number) => PAD.t + innerHeight() * (1 - scale().position(v));
  const band = () => innerWidth() / Math.max(1, merged.data.length);
  const groupWidth = () => Math.min(MAX_GROUP_WIDTH, band() * 0.64);
  const barWidth = () => (merged.stacked ? groupWidth() : groupWidth() / Math.max(1, series().length));
  const bandCentre = (i: number) => PAD.l + band() * i + band() / 2;

  const bars = (d: ChartDatum, i: number) => {
    const x0 = PAD.l + band() * i + (band() - groupWidth()) / 2;
    let positive = 0;
    let negative = 0;
    return series().flatMap((s, k) => {
      const v = valueOf(d, s.key);
      if (v === undefined) return [];
      const stackedBar = merged.stacked;
      const from = stackedBar ? (v >= 0 ? positive : negative) : 0;
      const to = from + v;
      const bar = {
        key: s.key,
        color: colorOf(s, k),
        x: (stackedBar ? x0 : x0 + k * barWidth()) + (stackedBar ? 0 : 1),
        y: Math.min(y(from), y(to)),
        width: Math.max(1, barWidth() - (stackedBar ? 0 : 2)),
        height: Math.max(0, Math.abs(y(to) - y(from)) - (stackedBar && from ? 1 : 0)),
        radius: stackedBar && k !== series().length - 1 ? 0 : 4,
      };
      if (v >= 0) positive = to;
      else negative = to;
      return [bar];
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover((h) => Math.min(lastIndex(), h + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover((h) => Math.max(0, h < 0 ? 0 : h - 1));
    } else if (e.key === 'Escape') setHover(-1);
  };

  const hovered = () => (hover() >= 0 ? merged.data[hover()] : undefined);
  const announcement = (d: ChartDatum) =>
    `${d.label}: ${series()
      .map((s) => `${s.label} ${chartValueText(d, s.key, format, translate('velvet.charts.chartSeries.noValue'))}`)
      .join(', ')}`;

  return (
    <div ref={ref} class={cx(typographyClass('body'), styles.chart, merged.class)}>
      <Show when={merged.showLegend ?? series().length > 1}>
        <div class={styles.chartPartLegend}>
          <For each={series()}>
            {(s, k) => (
              <Text as="span" variant="caption" tone="secondary" class={styles.chartPartLg}>
                <i style={{ background: colorOf(s, k()) }} />
                {s.label}
              </Text>
            )}
          </For>
        </div>
      </Show>
      <div class={styles.chartPartPlot} style={{ height: `${height()}px` }}>
        <svg
          width={width()}
          height={height()}
          role="img"
          aria-label={translate('velvet.charts.barChart.instructions', { label: label() })}
          tabindex={0}
          onKeyDown={onKeyDown}
          onFocus={() => hover() < 0 && setHover(0)}
          onBlur={() => setHover(-1)}
          onMouseLeave={() => setHover(-1)}
        >
          <For each={ticks()}>
            {(t) => (
              <g>
                <line x1={PAD.l} x2={width() - PAD.r} y1={y(t)} y2={y(t)} class={styles.chartPartGrid} />
                <text x={PAD.l - 8} y={y(t)} dy="0.32em" text-anchor="end" class={styles.chartPartTick}>
                  {format(t)}
                </text>
              </g>
            )}
          </For>
          <For each={merged.data}>
            {(d, i) => (
              <g
                onMouseEnter={() => setHover(i())}
                class={cx('vui-chart__group', hover() >= 0 && hover() !== i() && styles.chartPartGroupVariantDim)}
              >
                <rect x={PAD.l + band() * i()} y={PAD.t} width={band()} height={innerHeight()} fill="transparent" />
                <For each={bars(d, i())}>
                  {(bar) => (
                    <rect
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      rx={bar.radius}
                      class={styles.chartPartBar}
                      style={{ fill: bar.color, 'animation-delay': `${i() * 30}ms` }}
                    />
                  )}
                </For>
                <text
                  x={bandCentre(i())}
                  y={height() - 8}
                  text-anchor="middle"
                  class={cx(styles.chartPartTick, hover() === i() && styles.chartPartTickVariantOn)}
                >
                  {d.label}
                </text>
              </g>
            )}
          </For>
        </svg>
        <Show when={hovered()}>
          {(d) => (
            <div
              class={cx(styles.chartPartTip, typographyClass('caption'))}
              style={{
                left: `${clamp(bandCentre(hover()), TIP_MARGIN, width() - TIP_MARGIN)}px`,
                top: `${PAD.t}px`,
              }}
              aria-hidden="true"
            >
              <Text as="div" variant="label-sm" tone="inherit" class={styles.chartPartTipT}>
                {d().label}
              </Text>
              <For each={series()}>
                {(s, k) => (
                  <Text as="div" variant="caption" tone="inherit" class={styles.chartPartTipR}>
                    <i style={{ background: colorOf(s, k()) }} />
                    {s.label}
                    <Text as="b" variant="label-sm" tone="inherit">
                      {chartValueText(d(), s.key, format, translate('velvet.charts.chartSeries.noValue'))}
                    </Text>
                  </Text>
                )}
              </For>
            </div>
          )}
        </Show>
        <VisuallyHidden role="status">
          <Show when={hovered()}>{(d) => announcement(d())}</Show>
        </VisuallyHidden>
      </div>
    </div>
  );
};
