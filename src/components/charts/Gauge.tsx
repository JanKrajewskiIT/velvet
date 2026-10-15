import { useI18n } from '@jankrajewskiit/i18n';
import { children, createUniqueId, For, type JSX, mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Gauge.module.css';

const GAUGE_TONE = {
  brand: 'var(--action-primary)',
  success: 'var(--status-success-solid)',
  warning: 'var(--status-warning-solid)',
  danger: 'var(--status-danger-solid)',
  info: 'var(--status-info-solid)',
  neutral: 'var(--status-neutral-solid)',
} as const;

const SIZES = { sm: [136, 10], md: [188, 14], lg: [244, 18] } as const;

export type GaugeTone = keyof typeof GAUGE_TONE;

export interface GaugeThreshold {
  value: number;
  /** A tone name or any CSS colour. */
  tone: GaugeTone | (string & {});
}

export interface GaugeProps {
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  label?: JSX.Element;
  caption?: JSX.Element;
  /** @default the rounded value formatted in the active locale */
  format?: (v: number) => string;
  /** Small suffix after the number — %, ms, GB. */
  unit?: string;
  /** e.g. `[{ value: 70, tone: 'warning' }, { value: 90, tone: 'danger' }]` */
  thresholds?: GaugeThreshold[];
  /** Arc colour below the first threshold. @default 'brand' */
  tone?: GaugeTone;
  /** sm 136 · md 188 · lg 244 px wide. @default 'md' */
  size?: keyof typeof SIZES;
  /** min / max captions under the arc. @default true */
  showBounds?: boolean;
  class?: string;
}

const toneColor = (tone: string): string => (tone in GAUGE_TONE ? GAUGE_TONE[tone as GaugeTone] : tone);

/** Half-circle meter for one value against a range — utilisation, score, SLA, quota. `role="meter"`. Thresholds recolour the arc once the value passes them and draw a notch on the track; the numeric value is always shown. */
export const Gauge = (props: GaugeProps) => {
  const merged = mergeProps(
    { min: 0, max: 100, tone: 'brand', size: 'md', showBounds: true } satisfies Partial<GaugeProps>,
    props,
  );
  const i18n = useI18n();
  const format = (v: number) => (merged.format ?? ((n: number) => i18n.formatNumber(Math.round(n))))(v);
  const labelId = createUniqueId();
  const label = children(() => merged.label);
  const caption = children(() => merged.caption);

  const dial = () => SIZES[merged.size];
  const width = () => dial()[0];
  const stroke = () => dial()[1];
  const radius = () => (width() - stroke()) / 2;
  const centreY = () => radius() + stroke() / 2;
  const height = () => centreY() + stroke() / 2;
  const span = () => merged.max - merged.min || 1;
  const value = () => clamp(merged.value || 0, merged.min, merged.max);
  const progress = () => (value() - merged.min) / span();
  const thresholds = () => (merged.thresholds ?? []).slice().sort((a, b) => a.value - b.value);
  const arcColor = () => {
    const current = value();
    return toneColor(thresholds().reduce<string>((tone, t) => (current >= t.value ? t.tone : tone), merged.tone));
  };
  const arc = () =>
    `M${stroke() / 2},${centreY()} A${radius()},${radius()} 0 0 1 ${width() - stroke() / 2},${centreY()}`;
  const point = (q: number, r: number) => {
    const angle = Math.PI * (1 - q);
    return { x: width() / 2 + r * Math.cos(angle), y: centreY() - r * Math.sin(angle) };
  };
  const notches = () =>
    thresholds().map((t) => {
      const q = (t.value - merged.min) / span();
      const from = point(q, radius() - stroke() / 2 - 3);
      const to = point(q, radius() - stroke() / 2 - 8);
      return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: toneColor(t.tone) };
    });

  return (
    <div
      class={cx(typographyClass('body'), styles.gauge, merged.class)}
      role="meter"
      aria-valuemin={merged.min}
      aria-valuemax={merged.max}
      aria-valuenow={value()}
      aria-valuetext={format(value()) + (merged.unit ? ` ${merged.unit}` : '')}
      aria-labelledby={label() ? labelId : undefined}
    >
      <div class={styles.gaugePartDial} style={{ width: `${width()}px`, height: `${height()}px` }}>
        <svg width={width()} height={height()} viewBox={`0 0 ${width()} ${height()}`} aria-hidden="true">
          <path d={arc()} class={styles.gaugePartTrack} stroke-width={stroke()} />
          <path
            d={arc()}
            class={styles.gaugePartFill}
            stroke-width={stroke()}
            pathLength="100"
            style={{ stroke: arcColor(), 'stroke-dasharray': `${(progress() * 100).toFixed(2)} 100` }}
          />
          <For each={notches()}>
            {(n) => (
              <line x1={n.x1} y1={n.y1} x2={n.x2} y2={n.y2} class={styles.gaugePartTick} style={{ stroke: n.color }} />
            )}
          </For>
        </svg>
        <div class={styles.gaugePartValue}>
          <Text as="b" variant={merged.size === 'sm' ? 'h4' : merged.size === 'lg' ? 'kpi' : 'h3'} tone="inherit">
            {format(value())}
          </Text>
          <Show when={merged.unit}>
            {(unit) => (
              <Text as="span" variant="label" tone="inherit">
                {unit()}
              </Text>
            )}
          </Show>
        </div>
      </div>
      <Show when={merged.showBounds}>
        <div class={cx(styles.gaugePartBounds, typographyClass('overline'))} style={{ width: `${width()}px` }}>
          <Text as="span" variant="caption" tone="inherit">
            {format(merged.min)}
          </Text>
          <Text as="span" variant="caption" tone="inherit">
            {format(merged.max)}
          </Text>
        </div>
      </Show>
      <Show when={label() || caption()}>
        <div class={styles.gaugePartText}>
          <Show when={label()}>
            <Text as="div" variant="label" tone="inherit" id={labelId} class={'vui-gauge__label'}>
              {label()}
            </Text>
          </Show>
          <Show when={caption()}>
            <Text as="div" variant="caption" tone="tertiary" class="vui-gauge__caption">
              {caption()}
            </Text>
          </Show>
        </div>
      </Show>
    </div>
  );
};
