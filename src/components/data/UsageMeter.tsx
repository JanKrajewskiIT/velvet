import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { Meter } from '../primitives/Meter';
import styles from './UsageMeter.module.css';

const THRESHOLDS: readonly [number, number] = [0.7, 0.9];

export interface UsageMeterProps extends HtmlProps<HTMLDivElement> {
  label: JSX.Element;
  value: number | null;
  max?: number;
  unit?: string;
  valueText?: JSX.Element;
  hint?: JSX.Element;
  tone?: StatusTone;
  thresholds?: readonly [number, number];
  size?: 'sm' | 'md';
  format?: (value: number) => string;
}

export const UsageMeter = (props: UsageMeterProps) => {
  const merged = mergeProps(
    { max: 100, unit: '', thresholds: THRESHOLDS, size: 'md' } satisfies Partial<UsageMeterProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'label',
    'value',
    'max',
    'unit',
    'valueText',
    'hint',
    'tone',
    'thresholds',
    'size',
    'format',
    'class',
  ]);
  const i18n = useI18n();
  const formatter = createMemo(() => new Intl.NumberFormat(i18n.locale()));
  const format = (value: number | null) => (value == null ? '—' : (local.format ?? formatter().format)(value));
  const ratio = () => (local.max ? (local.value ?? 0) / local.max : 0);
  const tone = () =>
    local.tone ?? (ratio() >= local.thresholds[1] ? 'danger' : ratio() >= local.thresholds[0] ? 'warning' : 'brand');
  return (
    <div {...rest} class={cx(styles.root, local.class)} data-size={local.size}>
      <div class={styles.top}>
        <span class={styles.label}>{local.label}</span>
        <span class={styles.value}>
          {local.valueText ?? `${format(local.value)}${local.unit} / ${format(local.max)}${local.unit}`}
        </span>
      </div>
      <Meter
        value={local.value ?? 0}
        max={local.max}
        tone={tone()}
        size={local.size}
        label={typeof local.label === 'string' ? local.label : undefined}
      />
      <Show when={local.hint}>
        <span class={styles.hint}>{local.hint}</span>
      </Show>
    </div>
  );
};
