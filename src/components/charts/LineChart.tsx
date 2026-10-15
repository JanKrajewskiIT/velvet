import { createMemo, createSignal, createUniqueId, For, Index, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { positiveNumber } from '../../utils/numericOption';
import { Button } from '../actions/Button';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { ChartLegend } from './ChartLegend';
import { type ChartDatum, type ChartSeries, chartValueText, colorOf, defaultSeries, valueOf } from './chartSeries';
import { createChartFormat } from './createChartFormat';
import { createLineCursor } from './createLineCursor';
import { createLineGeometry, LINE_PAD } from './createLineGeometry';
import { createWidth } from './createWidth';
import styles from './LineChart.module.css';
import { LineChartTable } from './LineChartTable';
import { LineChartTooltip } from './LineChartTooltip';

const TIP_MARGIN = 70;

export interface LineChartProps {
  data: ChartDatum[];
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  /** Axis + tooltip formatter. @default compact numbers in the active locale (1.2K) */
  format?: (v: number) => string;
  /** Gradient fill under the first series. @default true */
  area?: boolean;
  /** @default true */
  curved?: boolean;
  /** Start in table view. */
  showTable?: boolean;
  /** Accessible name. @default localized "Line chart" */
  label?: string;
  class?: string;
}

/** Line / area chart with crosshair. Mouse, or focus + ←→ Home End, moves the crosshair and the value is announced. The "Table" toggle shows the same data as an accessible table with period-over-period Δ. */
export const LineChart = (props: LineChartProps) => {
  const merged = mergeProps({ height: 240, area: true, curved: true } satisfies Partial<LineChartProps>, props);
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const { ref, width } = createWidth();
  const [table, setTable] = createSignal(untrack(() => props.showTable ?? false));
  const gradientId = createUniqueId();
  const height = () => positiveNumber(merged.height, 240);

  const label = () => merged.label ?? translate('velvet.charts.lineChart.label');
  const series = createMemo(() => merged.series ?? defaultSeries(translate));
  const geometry = createLineGeometry({
    data: () => merged.data,
    series,
    width,
    height,
    curved: () => merged.curved,
    area: () => merged.area,
    gradientId,
  });
  const { x, y } = geometry;
  const cursor = createLineCursor(geometry);
  const hover = cursor.hover;

  const hovered = () => (hover() >= 0 ? merged.data[hover()] : undefined);
  const announcement = (d: ChartDatum) =>
    `${d.label}: ${series()
      .map((s) => `${s.label} ${chartValueText(d, s.key, format, translate('velvet.charts.chartSeries.noValue'))}`)
      .join(', ')}`;

  return (
    <div ref={ref} class={cx(typographyClass('body'), styles.chart, merged.class)}>
      <div class={styles.chartPartBarTop}>
        <Show when={series().length > 1} fallback={<span />}>
          <ChartLegend series={series()} />
        </Show>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={table() ? 'bar-chart' : 'list'}
          aria-pressed={table()}
          onClick={() => setTable(!table())}
        >
          {table() ? translate('velvet.charts.lineChart.chart') : translate('velvet.charts.lineChart.table')}
        </Button>
      </div>
      <Show when={!table()} fallback={<LineChartTable data={merged.data} series={series()} format={format} />}>
        <div class={styles.chartPartPlot} style={{ height: `${height()}px` }}>
          <svg
            width={width()}
            height={height()}
            role="img"
            aria-label={translate('velvet.charts.lineChart.instructions', { label: label() })}
            tabindex={0}
            onMouseMove={cursor.move}
            onMouseLeave={cursor.clear}
            onKeyDown={cursor.onKeyDown}
            onFocus={cursor.focus}
            onBlur={cursor.clear}
          >
            <defs>
              <For each={geometry.paths()}>
                {(p) => (
                  <linearGradient id={p.gradient} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" style={{ 'stop-color': p.color, 'stop-opacity': 0.22 }} />
                    <stop offset="1" style={{ 'stop-color': p.color, 'stop-opacity': 0 }} />
                  </linearGradient>
                )}
              </For>
            </defs>
            <For each={geometry.ticks()}>
              {(t) => (
                <g>
                  <line x1={LINE_PAD.l} x2={width() - LINE_PAD.r} y1={y(t)} y2={y(t)} class={styles.chartPartGrid} />
                  <text x={LINE_PAD.l - 8} y={y(t)} dy="0.32em" text-anchor="end" class={styles.chartPartTick}>
                    {format(t)}
                  </text>
                </g>
              )}
            </For>
            <For each={merged.data}>
              {(d, i) => (
                <Show when={i() % geometry.labelEvery() === 0}>
                  <text
                    x={x(i())}
                    y={height() - 8}
                    text-anchor="middle"
                    class={cx(styles.chartPartTick, hover() === i() && styles.chartPartTickVariantOn)}
                  >
                    {d.label}
                  </text>
                </Show>
              )}
            </For>
            <For each={geometry.paths()}>
              {(p) => (
                <g>
                  <Show when={p.fill}>
                    {(fill) => <path d={fill()} fill={`url(#${p.gradient})`} class={styles.chartPartArea} />}
                  </Show>
                  <path d={p.line} class={styles.chartPartLine} style={{ stroke: p.color }} pathLength="1" />
                </g>
              )}
            </For>
            <Show when={hovered()}>
              {(d) => (
                <>
                  <line
                    x1={x(hover())}
                    x2={x(hover())}
                    y1={LINE_PAD.t}
                    y2={geometry.baseline()}
                    class={styles.chartPartCross}
                  />
                  <Index each={series()}>
                    {(s, k) => (
                      <Show when={valueOf(d(), s().key) !== undefined}>
                        <circle
                          cx={x(hover())}
                          cy={y(valueOf(d(), s().key) ?? 0)}
                          r="4.5"
                          class={styles.chartPartPt}
                          style={{ stroke: colorOf(s(), k) }}
                        />
                      </Show>
                    )}
                  </Index>
                </>
              )}
            </Show>
          </svg>
          <Show when={hovered()}>
            {(d) => (
              <LineChartTooltip
                datum={d()}
                series={series()}
                format={format}
                left={clamp(x(hover()), TIP_MARGIN, width() - TIP_MARGIN)}
                top={LINE_PAD.t}
              />
            )}
          </Show>
          <VisuallyHidden role="status">
            <Show when={hovered()}>{(d) => announcement(d())}</Show>
          </VisuallyHidden>
        </div>
      </Show>
    </div>
  );
};
