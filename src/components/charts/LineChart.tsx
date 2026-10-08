import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, createUniqueId, For, Index, mergeProps, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { niceTicks } from './chartScale';
import { type ChartDatum, type ChartSeries, colorOf, defaultSeries, valueOf } from './chartSeries';
import { createChartFormat } from './createChartFormat';
import { createWidth } from './createWidth';
import { linePath, type Point, smoothPath } from './linePath';

const PAD = { l: 40, r: 12, t: 12, b: 28 } as const;
const TIP_MARGIN = 70;
const MIN_LABEL_SPACING = 64;

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
  const i18n = useI18n();
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const deltaFormat = createMemo(
    () =>
      new Intl.NumberFormat(i18n.locale(), {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        signDisplay: 'always',
      }),
  );
  const { ref, width } = createWidth();
  const [hover, setHover] = createSignal(-1);
  const [table, setTable] = createSignal(untrack(() => props.showTable ?? false));
  const gradientId = createUniqueId();

  const label = () => merged.label ?? translate('velvet.charts.lineChart.label');
  const series = createMemo(() => merged.series ?? defaultSeries(translate));
  const innerWidth = () => width() - PAD.l - PAD.r;
  const innerHeight = () => merged.height - PAD.t - PAD.b;
  const lastIndex = () => merged.data.length - 1;

  const ticks = createMemo(() =>
    niceTicks(Math.max(1, ...merged.data.flatMap((d) => series().map((s) => valueOf(d, s.key))))),
  );
  const top = () => ticks().at(-1) ?? 1;
  const x = (i: number) => PAD.l + (merged.data.length < 2 ? innerWidth() / 2 : (i / lastIndex()) * innerWidth());
  const y = (v: number) => PAD.t + innerHeight() - (v / top()) * innerHeight();
  const labelEvery = () => Math.ceil(merged.data.length / Math.max(2, Math.floor(innerWidth() / MIN_LABEL_SPACING)));
  const baseline = () => PAD.t + innerHeight();

  const paths = createMemo(() =>
    series().map((s, k) => {
      const points: Point[] = merged.data.map((d, i) => [x(i), y(valueOf(d, s.key))]);
      const line = merged.curved ? smoothPath(points) : linePath(points);
      const first = points[0];
      const last = points.at(-1);
      const fill =
        k === 0 && merged.area && first && last && points.length > 1
          ? `${line}L${last[0]},${baseline()}L${first[0]},${baseline()}Z`
          : undefined;
      return { key: s.key, color: colorOf(s, k), line, fill, gradient: `${gradientId}-${k}` };
    }),
  );

  const move = (e: MouseEvent & { currentTarget: SVGSVGElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - PAD.l) / innerWidth()) * lastIndex());
    setHover(Math.max(0, Math.min(lastIndex(), i)));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover((h) => Math.min(lastIndex(), h + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover((h) => Math.max(0, h - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHover(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHover(lastIndex());
    } else if (e.key === 'Escape') setHover(-1);
  };

  const hovered = () => (hover() >= 0 ? merged.data[hover()] : undefined);
  const announcement = (d: ChartDatum) =>
    `${d.label}: ${series()
      .map((s) => `${s.label} ${format(valueOf(d, s.key))}`)
      .join(', ')}`;

  const singleSeriesKey = () => (series().length === 1 ? series()[0]?.key : undefined);
  /** Change against the previous period; `null` for the first period or a zero base. */
  const delta = (i: number, key: string): number | null => {
    const previous = merged.data[i - 1];
    const current = merged.data[i];
    if (!previous || !current) return null;
    const base = valueOf(previous, key);
    return base ? (valueOf(current, key) - base) / base : null;
  };
  const deltaText = (i: number, key: string) => {
    const change = delta(i, key);
    return change === null ? '—' : deltaFormat().format(change);
  };
  const deltaColor = (i: number, key: string) => {
    const change = delta(i, key);
    if (change === null) return 'var(--fg-tertiary)';
    return change >= 0 ? 'var(--status-success-fg)' : 'var(--status-danger-fg)';
  };

  return (
    <div ref={ref} class={cx('vui-chart', merged.class)}>
      <div class="vui-chart__bar-top">
        <Show when={series().length > 1} fallback={<span />}>
          <div class="vui-chart__legend">
            <For each={series()}>
              {(s, k) => (
                <span class="vui-chart__lg">
                  <i style={{ background: colorOf(s, k()) }} />
                  {s.label}
                </span>
              )}
            </For>
          </div>
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
      <Show
        when={!table()}
        fallback={
          <div class="vui-chart__table">
            <table class="vui-table">
              <thead>
                <tr>
                  <th>{translate('velvet.charts.lineChart.periodHeader')}</th>
                  <For each={series()}>{(s) => <th class="vui-table__num">{s.label}</th>}</For>
                  <Show when={singleSeriesKey()}>
                    <th class="vui-table__num">Δ</th>
                  </Show>
                </tr>
              </thead>
              <tbody>
                <For each={merged.data}>
                  {(d, i) => (
                    <tr>
                      <td>{d.label}</td>
                      <For each={series()}>{(s) => <td class="vui-table__num">{format(valueOf(d, s.key))}</td>}</For>
                      <Show when={singleSeriesKey()}>
                        {(key) => (
                          <td class="vui-table__num" style={{ color: deltaColor(i(), key()) }}>
                            {deltaText(i(), key())}
                          </td>
                        )}
                      </Show>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        }
      >
        <div class="vui-chart__plot" style={{ height: `${merged.height}px` }}>
          <svg
            width={width()}
            height={merged.height}
            role="img"
            aria-label={translate('velvet.charts.lineChart.instructions', { label: label() })}
            tabindex={0}
            onMouseMove={move}
            onMouseLeave={() => setHover(-1)}
            onKeyDown={onKeyDown}
            onFocus={() => hover() < 0 && setHover(lastIndex())}
            onBlur={() => setHover(-1)}
          >
            <defs>
              <For each={paths()}>
                {(p) => (
                  <linearGradient id={p.gradient} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" style={{ 'stop-color': p.color, 'stop-opacity': 0.22 }} />
                    <stop offset="1" style={{ 'stop-color': p.color, 'stop-opacity': 0 }} />
                  </linearGradient>
                )}
              </For>
            </defs>
            <For each={ticks()}>
              {(t) => (
                <g>
                  <line x1={PAD.l} x2={width() - PAD.r} y1={y(t)} y2={y(t)} class="vui-chart__grid" />
                  <text x={PAD.l - 8} y={y(t)} dy="0.32em" text-anchor="end" class="vui-chart__tick">
                    {format(t)}
                  </text>
                </g>
              )}
            </For>
            <For each={merged.data}>
              {(d, i) => (
                <Show when={i() % labelEvery() === 0}>
                  <text
                    x={x(i())}
                    y={merged.height - 8}
                    text-anchor="middle"
                    class={cx('vui-chart__tick', hover() === i() && 'vui-chart__tick--on')}
                  >
                    {d.label}
                  </text>
                </Show>
              )}
            </For>
            <For each={paths()}>
              {(p) => (
                <g>
                  <Show when={p.fill}>
                    {(fill) => <path d={fill()} fill={`url(#${p.gradient})`} class="vui-chart__area" />}
                  </Show>
                  <path d={p.line} class="vui-chart__line" style={{ stroke: p.color }} pathLength="1" />
                </g>
              )}
            </For>
            <Show when={hovered()}>
              {(d) => (
                <>
                  <line x1={x(hover())} x2={x(hover())} y1={PAD.t} y2={baseline()} class="vui-chart__cross" />
                  <Index each={series()}>
                    {(s, k) => (
                      <circle
                        cx={x(hover())}
                        cy={y(valueOf(d(), s().key))}
                        r="4.5"
                        class="vui-chart__pt"
                        style={{ stroke: colorOf(s(), k) }}
                      />
                    )}
                  </Index>
                </>
              )}
            </Show>
          </svg>
          <Show when={hovered()}>
            {(d) => (
              <div
                class="vui-chart__tip"
                style={{
                  left: `${Math.max(TIP_MARGIN, Math.min(width() - TIP_MARGIN, x(hover())))}px`,
                  top: `${PAD.t}px`,
                }}
                aria-hidden="true"
              >
                <div class="vui-chart__tip-t">{d().label}</div>
                <For each={series()}>
                  {(s, k) => (
                    <div class="vui-chart__tip-r">
                      <i style={{ background: colorOf(s, k()) }} />
                      {s.label}
                      <b>{format(valueOf(d(), s.key))}</b>
                    </div>
                  )}
                </For>
              </div>
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
