import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, Index, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { seriesColor } from './chartScale';

const LABEL_PAD = 56;
const AXIS_LABEL_OFFSET = 16;
const MIN_AXES = 3;

export interface RadarAxis {
  key: string;
  label: string;
  /** Axis maximum; defaults to the chart max or the largest value. */
  max?: number;
}

export interface RadarSeries {
  label: string;
  values: Record<string, number>;
  /** Defaults to --dv-N in order. */
  color?: string;
}

export interface RadarChartProps {
  axes: RadarAxis[];
  series: RadarSeries[];
  /** Square px size (scales down to fit). @default 300 */
  size?: number;
  /** Concentric rings. @default 4 */
  levels?: number;
  /** Shared maximum for every axis. */
  max?: number;
  /** @default the value formatted in the active locale */
  format?: (v: number) => string;
  /** @default true */
  showLegend?: boolean;
  /** Tinted area under each series. @default true */
  fill?: boolean;
  /** Accessible name — values are appended automatically. @default localized "Radar chart" */
  label?: string;
  class?: string;
}

interface RadarHover {
  series: string;
  axis: string;
  x: number;
  y: number;
  value: number;
  color: string;
}

const valueAt = (series: RadarSeries, key: string): number => {
  const v = Number(series.values[key]);
  return Number.isFinite(v) ? Math.max(0, v) : 0;
};

/** Compares 1–3 profiles across 5–8 dimensions. The legend toggles series, hovering a vertex dims the others and shows its value; every value is also in the accessible name. */
export const RadarChart = (props: RadarChartProps) => {
  const merged = mergeProps(
    { size: 300, levels: 4, showLegend: true, fill: true } satisfies Partial<RadarChartProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const format = (v: number) => (merged.format ?? ((n: number) => i18n.formatNumber(n)))(v);
  const label = () => merged.label ?? translate('velvet.charts.radarChart.label');
  const [excluded, setExcluded] = createSignal<string[]>([]);
  const [hover, setHover] = createSignal<RadarHover | null>(null);

  const items = createMemo(() => merged.series.map((s, i) => ({ ...s, color: s.color ?? seriesColor(i) })));
  const visible = createMemo(() => items().filter((s) => !excluded().includes(s.label)));
  const centre = () => merged.size / 2;
  const radius = () => merged.size / 2 - LABEL_PAD;
  const axisCount = () => Math.max(merged.axes.length, MIN_AXES);
  const axisMax = (a: RadarAxis) => a.max ?? merged.max ?? Math.max(1, ...items().map((s) => valueAt(s, a.key)));
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axisCount();
  const point = (i: number, r: number): [number, number] => [
    centre() + Math.cos(angle(i)) * r,
    centre() + Math.sin(angle(i)) * r,
  ];
  const ring = (fraction: number) => merged.axes.map((_, i) => point(i, radius() * fraction).join(',')).join(' ');
  const rings = () => {
    const levels = merged.levels;
    const out: string[] = [];
    for (let k = 1; k <= levels; k++) out.push(ring(k / levels));
    return out;
  };

  const description = () =>
    visible()
      .map((s) => `${s.label}: ${merged.axes.map((a) => `${a.label} ${format(valueAt(s, a.key))}`).join(', ')}`)
      .join('; ');

  const polygons = createMemo(() =>
    visible().map((s) => ({
      series: s,
      points: merged.axes.map((a, i) => point(i, radius() * Math.min(1, valueAt(s, a.key) / axisMax(a)))),
    })),
  );

  const toggle = (label: string) =>
    setExcluded((current) => {
      if (current.includes(label)) return current.filter((x) => x !== label);
      return visible().length > 1 ? [...current, label] : current;
    });

  const textAnchor = (i: number) => {
    const c = Math.cos(angle(i));
    if (Math.abs(c) < 0.2) return 'middle';
    return c > 0 ? 'start' : 'end';
  };
  const hoverAxisLabel = (h: RadarHover) => merged.axes.find((a) => a.key === h.axis)?.label;

  return (
    <div class={cx('vui-chart', 'vui-radar', merged.class)}>
      <Show when={merged.showLegend && items().length > 1}>
        <div class="vui-chart__legend">
          <For each={items()}>
            {(s) => (
              <button
                type="button"
                class={cx('vui-chart__lg', 'vui-radar__lg', excluded().includes(s.label) && 'vui-radar__lg--off')}
                aria-pressed={!excluded().includes(s.label)}
                onClick={() => toggle(s.label)}
              >
                <i style={{ background: s.color }} />
                {s.label}
              </button>
            )}
          </For>
        </div>
      </Show>
      <div class="vui-chart__plot" style={{ width: `${merged.size}px`, 'max-width': '100%' }}>
        <svg
          viewBox={`0 0 ${merged.size} ${merged.size}`}
          width="100%"
          role="img"
          aria-label={`${label()}. ${description()}`}
        >
          <For each={rings()}>{(points) => <polygon points={points} class="vui-radar__ring" />}</For>
          <For each={merged.axes}>
            {(_, i) => (
              <line
                x1={centre()}
                y1={centre()}
                x2={point(i(), radius())[0]}
                y2={point(i(), radius())[1]}
                class="vui-chart__grid"
              />
            )}
          </For>
          <For each={merged.axes}>
            {(a, i) => (
              <text
                x={point(i(), radius() + AXIS_LABEL_OFFSET)[0]}
                y={point(i(), radius() + AXIS_LABEL_OFFSET)[1]}
                class={cx('vui-chart__tick', 'vui-radar__axis', hover()?.axis === a.key && 'vui-chart__tick--on')}
                text-anchor={textAnchor(i())}
                dominant-baseline="middle"
              >
                {a.label}
              </text>
            )}
          </For>
          <For each={polygons()}>
            {(shape, si) => (
              <g
                class={cx(
                  'vui-radar__series',
                  hover() && hover()?.series !== shape.series.label && 'vui-radar__series--dim',
                )}
                style={{ '--c': shape.series.color, 'animation-delay': `${si() * 80}ms` }}
              >
                <polygon
                  points={shape.points.map((p) => p.join(',')).join(' ')}
                  class="vui-radar__area"
                  fill-opacity={merged.fill ? undefined : 0}
                />
                <Index each={shape.points}>
                  {(p, i) => {
                    const axis = () => merged.axes[i];
                    const active = () => hover()?.series === shape.series.label && hover()?.axis === axis()?.key;
                    return (
                      <circle
                        cx={p()[0]}
                        cy={p()[1]}
                        r={active() ? 5 : 3.5}
                        class="vui-radar__pt"
                        onMouseEnter={() => {
                          const a = axis();
                          if (a)
                            setHover({
                              series: shape.series.label,
                              axis: a.key,
                              x: p()[0],
                              y: p()[1],
                              value: valueAt(shape.series, a.key),
                              color: shape.series.color,
                            });
                        }}
                        onMouseLeave={() => setHover(null)}
                      />
                    );
                  }}
                </Index>
              </g>
            )}
          </For>
        </svg>
        <Show when={hover()}>
          {(h) => (
            <div
              class="vui-chart__tip vui-radar__tip"
              style={{ left: `${(h().x / merged.size) * 100}%`, top: `${(h().y / merged.size) * 100}%` }}
              aria-hidden="true"
            >
              <span class="vui-radar__tip-k">
                <i style={{ background: h().color }} />
                {h().series}
              </span>
              <span>
                {hoverAxisLabel(h())}
                <strong>{format(h().value)}</strong>
              </span>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
};
