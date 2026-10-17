import { children, createMemo, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import type { HtmlProps } from '../../utils/polymorphic';
import { Text } from '../primitives/Text';
import type { ProgressTone } from './Progress';
import styles from './ProgressRing.module.css';

const PROGRESS_CLASSES = {
  success: styles.progressVariantSuccess,
  warning: styles.progressVariantWarning,
  danger: styles.progressVariantDanger,
  neutral: styles.progressVariantNeutral,
} as const;

export interface ProgressRingProps extends HtmlProps<HTMLSpanElement, 'role'> {
  value?: number;
  /** @default 100 */
  max?: number;
  /** Diameter in px. @default 48 */
  size?: number;
  /** Stroke width in px. @default 4 */
  stroke?: number;
  /** @default 'brand' */
  tone?: ProgressTone;
  /** Show the percentage in the centre. @default true */
  showValue?: boolean;
  /** Accessible name; for `role="img"` it carries the value. */
  label?: string;
  /** progressbar (task) · meter (measured value) · img (score badge). @default 'progressbar' */
  role?: 'progressbar' | 'meter' | 'img';
  /** Custom centre content — replaces the % value (e.g. "82/100"). */
  children?: JSX.Element;
}

const MIN_VALUE_FONT_PX = 10;
const VALUE_FONT_RATIO = 0.24;

/** Circular progress with centred percentage. */
export const ProgressRing = (props: ProgressRingProps) => {
  const merged = mergeProps(
    {
      value: 0,
      max: 100,
      size: 48,
      stroke: 4,
      tone: 'brand',
      showValue: true,
      role: 'progressbar',
    } satisfies ProgressRingProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'value',
    'max',
    'size',
    'stroke',
    'tone',
    'showValue',
    'label',
    'role',
    'class',
    'style',
    'children',
  ]);
  const centre = children(() => local.children);
  const radius = () => (local.size - local.stroke) / 2;
  const circumference = createMemo(() => 2 * Math.PI * radius());
  const fraction = () => clamp(local.value / local.max, 0, 1);
  const hasRange = () => local.role !== 'img';

  return (
    <span
      {...rest}
      class={cx(styles.ring, variantClass(PROGRESS_CLASSES, local.tone), local.class)}
      style={{ ...local.style, width: `${local.size}px`, height: `${local.size}px` }}
      role={local.role}
      aria-valuemin={hasRange() ? 0 : undefined}
      aria-valuemax={hasRange() ? local.max : undefined}
      aria-valuenow={hasRange() ? local.value : undefined}
      aria-label={local.label}
    >
      <svg viewBox={`0 0 ${local.size} ${local.size}`} aria-hidden="true">
        <circle
          cx={local.size / 2}
          cy={local.size / 2}
          r={radius()}
          stroke-width={local.stroke}
          class={styles.ringPartTrack}
        />
        <circle
          cx={local.size / 2}
          cy={local.size / 2}
          r={radius()}
          stroke-width={local.stroke}
          class={styles.ringPartBar}
          style={{
            'stroke-dasharray': String(circumference()),
            'stroke-dashoffset': String(circumference() * (1 - fraction())),
          }}
        />
      </svg>
      <Show
        when={centre() != null}
        fallback={
          <Show when={local.showValue}>
            <Text
              as="span"
              variant="label-sm"
              tone="inherit"
              class={styles.ringPartValue}
              style={{ '--ring-value-size': `${Math.max(MIN_VALUE_FONT_PX, local.size * VALUE_FONT_RATIO)}px` }}
            >
              {Math.round(fraction() * 100)}
              <Text as="small" variant="micro" tone="inherit">
                %
              </Text>
            </Text>
          </Show>
        }
      >
        {centre()}
      </Show>
    </span>
  );
};
