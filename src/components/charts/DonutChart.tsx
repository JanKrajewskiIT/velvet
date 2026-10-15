import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { createRecordKeys } from '../../hooks/createRecordKeys';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { RowKey } from '../data/rowData';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { percentOf, seriesColor } from './chartScale';
import styles from './DonutChart.module.css';

const MAX_GAP = 3;

export interface DonutDatum {
  id?: RowKey;
  label: string;
  value: number;
  /** Defaults to --dv-N in order. */
  color?: string;
}

export interface DonutChartProps {
  getKey?: (datum: DonutDatum, index: number) => RowKey;
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
  const [excluded, setExcluded] = createSignal<RowKey[]>([]);
  const [hover, setHover] = createSignal<RowKey | null>(null);
  const keys = createRecordKeys(
    () => merged.data,
    (datum, index) => merged.getKey?.(datum, index) ?? datum.id ?? datum.label,
    'DonutChart',
  );

  const items = createMemo(() => {
    if (
      !Number.isFinite(merged.size) ||
      merged.size <= 0 ||
      !Number.isFinite(merged.thickness) ||
      merged.thickness <= 0 ||
      merged.thickness >= merged.size
    )
      throw new RangeError('Donut thickness must be positive and smaller than its finite size.');
    if (merged.data.some((datum) => !Number.isFinite(datum.value) || datum.value < 0))
      throw new RangeError('Donut values must be finite and non-negative.');
    return merged.data.map((d, i) => ({ ...d, key: keys.keys()[i] ?? i, color: d.color ?? seriesColor(i) }));
  });
  createEffect(() => {
    const available = new Set(items().map((item) => item.key));
    setExcluded((current) => {
      const next = current.filter((key) => available.has(key));
      return available.size && next.length === available.size ? next.slice(1) : next;
    });
  });
  const visible = createMemo(() => items().filter((d) => !excluded().includes(d.key)));
  const total = createMemo(() => {
    const value = visible().reduce((sum, d) => sum + d.value, 0);
    if (!Number.isFinite(value)) throw new RangeError('Donut total must be finite.');
    return value;
  });
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

  const hovered = () => visible().find((d) => d.key === hover());
  const summary = () =>
    visible()
      .map((d) => `${d.label} ${percentOf(d.value, total())}%`)
      .join(', ');

  const toggle = (label: RowKey) =>
    setExcluded((current) => {
      if (current.includes(label)) return current.filter((x) => x !== label);
      return visible().length > 1 ? [...current, label] : current;
    });

  return (
    <div class={cx(styles.donut, merged.class)}>
      <div class={styles.donutPartRing} style={{ width: `${merged.size}px`, height: `${merged.size}px` }}>
        <svg viewBox={`0 0 ${merged.size} ${merged.size}`} role="img" aria-label={`${label()}: ${summary()}`}>
          <circle
            cx={centre()}
            cy={centre()}
            r={radius()}
            class={styles.donutPartTrack}
            stroke-width={merged.thickness}
          />
          <For each={segments()}>
            {(s) => (
              <circle
                cx={centre()}
                cy={centre()}
                r={radius()}
                stroke-width={merged.thickness}
                class={cx(styles.donutPartSeg, hover() !== null && hover() !== s.key && styles.donutPartSegVariantDim)}
                style={{
                  stroke: s.color,
                  'stroke-dasharray': `${s.dash} ${circumference()}`,
                  'stroke-dashoffset': -s.offset,
                }}
                onMouseEnter={() => setHover(s.key)}
                onMouseLeave={() => setHover(null)}
              />
            )}
          </For>
        </svg>
        <div class={styles.donutPartCenter} aria-hidden="true">
          <span class={styles.donutPartValue}>
            <Show when={hovered()} fallback={format(total())}>
              {(d) => `${percentOf(d().value, total())}%`}
            </Show>
          </span>
          <Text as="span" variant="caption" tone="tertiary" class={styles.donutPartLabel}>
            <Show when={hovered()} fallback={centerLabel()}>
              {(d) => d().label}
            </Show>
          </Text>
        </div>
      </div>
      <ul class={styles.donutPartLegend}>
        <For each={items()}>
          {(d) => {
            const on = () => !excluded().includes(d.key);
            return (
              <li>
                <button
                  type="button"
                  aria-pressed={on()}
                  class={cx(typographyClass('body-sm'), styles.donutPartItem, !on() && styles.donutPartItemVariantOff)}
                  onMouseEnter={() => on() && setHover(d.key)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => on() && setHover(d.key)}
                  onBlur={() => setHover(null)}
                  onClick={() => toggle(d.key)}
                >
                  <i style={{ background: d.color }} />
                  <Text as="span" variant="caption" tone="inherit" class={styles.donutPartName}>
                    {d.label}
                  </Text>
                  <Text as="span" variant="body-sm" tone="secondary" tabular class="vui-donut__num">
                    {format(d.value)}
                  </Text>
                  <Text as="span" variant="kbd" tone="inherit" class={styles.donutPartPct}>
                    {on() && total() ? `${percentOf(d.value, total())}%` : '—'}
                  </Text>
                </button>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};
