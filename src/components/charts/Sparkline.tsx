import { useI18n } from '@jankrajewskiit/i18n';
import { createSignal, createUniqueId, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { Text } from '../primitives/Text';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { seriesColor } from './chartScale';
import { createWidth } from './createWidth';
import styles from './Sparkline.module.css';

const DEFAULT_WIDTH = 160;
const INSET = 2;
const PAD_Y = 3;

export interface SparklineProps {
  data: number[];
  /** px. @default 40 */
  height?: number;
  /** @default 'var(--dv-1)' */
  color?: string;
  /** @default true */
  area?: boolean;
  /** @default the value formatted in the active locale */
  format?: (v: number) => string;
  /** Per-point labels for the readout (dates). */
  labels?: string[];
  /** Accessible name. @default localized "Trend" */
  label?: string;
  class?: string;
}

/** Tiny inline trend for stat cards and table cells. Scrub with the mouse or focus + ←→; the readout floats top-right and is announced. The last point is marked. */
export const Sparkline = (props: SparklineProps) => {
  const merged = mergeProps({ height: 40, color: seriesColor(0), area: true } satisfies Partial<SparklineProps>, props);
  const i18n = useI18n();
  const translate = useTranslate();
  const format = (v: number) => (merged.format ?? ((n: number) => i18n.formatNumber(n)))(v);
  const label = () => merged.label ?? translate('velvet.charts.sparkline.label');
  const { ref, width } = createWidth(DEFAULT_WIDTH);
  const [index, setIndex] = createSignal(-1);
  const gradientId = createUniqueId();

  const lastIndex = () => merged.data.length - 1;
  const minimum = () => Math.min(...merged.data);
  const range = () => Math.max(...merged.data) - minimum() || 1;
  const x = (k: number) => INSET + (k / Math.max(1, lastIndex())) * (width() - 2 * INSET);
  const y = (v: number) => PAD_Y + (1 - (v - minimum()) / range()) * (merged.height - 2 * PAD_Y);
  const path = () => merged.data.map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const current = () => (index() >= 0 ? index() : lastIndex());
  const marker = () => {
    const value = merged.data[current()];
    return value === undefined ? undefined : { x: x(current()), y: y(value) };
  };

  const valueText = (k: number) => {
    const value = merged.data[k];
    return value === undefined ? '' : format(value);
  };
  const readout = (k: number) => {
    const caption = merged.labels?.[k];
    return caption ? `${caption} ${valueText(k)}` : valueText(k);
  };

  const onMouseMove = (e: MouseEvent & { currentTarget: SVGSVGElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIndex(clamp(Math.round(((e.clientX - rect.left) / rect.width) * lastIndex()), 0, lastIndex()));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIndex(Math.min(lastIndex(), current() + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndex(Math.max(0, current() - 1));
    } else if (e.key === 'Escape') setIndex(-1);
  };

  return (
    <div ref={ref} class={cx(styles.spark, merged.class)}>
      <svg
        width={width()}
        height={merged.height}
        role="img"
        tabindex={0}
        aria-label={`${label()}: ${readout(current())}`}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setIndex(-1)}
        onKeyDown={onKeyDown}
        onBlur={() => setIndex(-1)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style={{ 'stop-color': merged.color, 'stop-opacity': 0.25 }} />
            <stop offset="1" style={{ 'stop-color': merged.color, 'stop-opacity': 0 }} />
          </linearGradient>
        </defs>
        <Show when={merged.area && merged.data.length > 0}>
          <path
            d={`${path()}L${x(lastIndex())},${merged.height}L${x(0)},${merged.height}Z`}
            fill={`url(#${gradientId})`}
          />
        </Show>
        <path
          d={path()}
          fill="none"
          style={{ stroke: merged.color }}
          stroke-width="1.75"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <Show when={index() >= 0}>
          <line x1={x(index())} x2={x(index())} y1="0" y2={merged.height} class={styles.chartPartCross} />
        </Show>
        <Show when={marker()}>
          {(point) => (
            <circle
              cx={point().x}
              cy={point().y}
              r="3"
              style={{ fill: merged.color }}
              stroke="var(--bg-raised)"
              stroke-width="1.5"
            />
          )}
        </Show>
      </svg>
      <Show when={index() >= 0}>
        <Text as="span" variant="kbd" tone="inherit" class={styles.sparkPartVal} aria-hidden="true">
          <Show when={merged.labels?.[index()]}>
            {(caption) => (
              <Text as="span" variant="caption" tone="inherit">
                {caption()}
              </Text>
            )}
          </Show>
          {valueText(index())}
        </Text>
      </Show>
      <VisuallyHidden role="status">{index() >= 0 ? readout(index()) : ''}</VisuallyHidden>
    </div>
  );
};
