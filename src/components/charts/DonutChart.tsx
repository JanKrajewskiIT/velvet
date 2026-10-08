import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { percentOf, seriesColor } from './chartScale';

const MAX_GAP = 3;

export interface DonutDatum {
  label: string;
  value: number;
  /** Defaults to --dv-N in order. */
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  /** px. @default 180 */
  size?: number;
  /** @default 22 */
  thickness?: number;
  /** @default the value formatted in the active locale */
  format?: (v: number) => string;
  /** @default localized "Total" */
  centerLabel?: string;
  /** Accessible name — shares are appended automatically. @default localized "Donut chart" */
  label?: string;
  class?: string;
}

/** Part-to-whole donut with an interactive legend: click an entry to exclude it and recut the rest (at least one stays); hover or focus a segment or entry to see its share in the centre. Max ~6 slices — group the tail as "Other". */
export const DonutChart = (props: DonutChartProps) => {
  const merged = mergeProps({ size: 180, thickness: 22 } satisfies Partial<DonutChartProps>, props);
  const i18n = useI18n();
  const translate = useTranslate();
  const format = (v: number) => (merged.format ?? ((n: number) => i18n.formatNumber(n)))(v);
  const label = () => merged.label ?? translate('velvet.charts.donutChart.label');
  const centerLabel = () => merged.centerLabel ?? translate('velvet.charts.donutChart.centerLabel');
  const [excluded, setExcluded] = createSignal<string[]>([]);
  const [hover, setHover] = createSignal<string | null>(null);

  const items = createMemo(() => merged.data.map((d, i) => ({ ...d, color: d.color ?? seriesColor(i) })));
  const visible = createMemo(() => items().filter((d) => !excluded().includes(d.label)));
  const total = createMemo(() => visible().reduce((sum, d) => sum + d.value, 0));
  const radius = () => (merged.size - merged.thickness) / 2;
  const circumference = () => 2 * Math.PI * radius();
  const centre = () => merged.size / 2;

  const segments = createMemo(() => {
    let offset = 0;
    return visible().map((d) => {
      const length = total() ? (d.value / total()) * circumference() : 0;
      const gap = visible().length > 1 ? Math.min(MAX_GAP, length / 3) : 0;
      const segment = { ...d, dash: Math.max(0, length - gap), offset };
      offset += length;
      return segment;
    });
  });

  const hovered = () => visible().find((d) => d.label === hover());
  const summary = () =>
    visible()
      .map((d) => `${d.label} ${percentOf(d.value, total())}%`)
      .join(', ');

  const toggle = (label: string) =>
    setExcluded((current) => {
      if (current.includes(label)) return current.filter((x) => x !== label);
      return visible().length > 1 ? [...current, label] : current;
    });

  return (
    <div class={cx('vui-donut', merged.class)}>
      <div class="vui-donut__ring" style={{ width: `${merged.size}px`, height: `${merged.size}px` }}>
        <svg viewBox={`0 0 ${merged.size} ${merged.size}`} role="img" aria-label={`${label()}: ${summary()}`}>
          <circle cx={centre()} cy={centre()} r={radius()} class="vui-donut__track" stroke-width={merged.thickness} />
          <For each={segments()}>
            {(s) => (
              <circle
                cx={centre()}
                cy={centre()}
                r={radius()}
                stroke-width={merged.thickness}
                class={cx('vui-donut__seg', hover() && hover() !== s.label && 'vui-donut__seg--dim')}
                style={{
                  stroke: s.color,
                  'stroke-dasharray': `${s.dash} ${circumference()}`,
                  'stroke-dashoffset': -s.offset,
                }}
                onMouseEnter={() => setHover(s.label)}
                onMouseLeave={() => setHover(null)}
              />
            )}
          </For>
        </svg>
        <div class="vui-donut__center" aria-hidden="true">
          <span class="vui-donut__value">
            <Show when={hovered()} fallback={format(total())}>
              {(d) => `${percentOf(d().value, total())}%`}
            </Show>
          </span>
          <span class="vui-donut__label">
            <Show when={hovered()} fallback={centerLabel()}>
              {(d) => d().label}
            </Show>
          </span>
        </div>
      </div>
      <ul class="vui-donut__legend">
        <For each={items()}>
          {(d) => {
            const on = () => !excluded().includes(d.label);
            return (
              <li>
                <button
                  type="button"
                  aria-pressed={on()}
                  class={cx('vui-donut__item', !on() && 'vui-donut__item--off')}
                  onMouseEnter={() => on() && setHover(d.label)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => on() && setHover(d.label)}
                  onBlur={() => setHover(null)}
                  onClick={() => toggle(d.label)}
                >
                  <i style={{ background: d.color }} />
                  <span class="vui-donut__name">{d.label}</span>
                  <span class="vui-donut__num">{format(d.value)}</span>
                  <span class="vui-donut__pct">{on() && total() ? `${percentOf(d.value, total())}%` : '—'}</span>
                </button>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};
