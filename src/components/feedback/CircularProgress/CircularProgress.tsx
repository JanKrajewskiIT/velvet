import { createMemo, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CircularProgress.module.css';

interface CircularProgressProps {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  thickness?: number;
  showValue?: boolean;
  label?: string;
}

const SIZE_MAP = { sm: 32, md: 48, lg: 64 } as const;

const sizeClassByValue: Record<NonNullable<CircularProgressProps['size']>, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const variantClassByValue: Record<NonNullable<CircularProgressProps['variant']>, string | undefined> = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
};

const CircularProgress = (props: Props<CircularProgressProps>) => {
  const [local, rest] = splitProps(props, ['value', 'size', 'variant', 'thickness', 'showValue', 'label', 'class']);
  const size = createMemo(() => local.size ?? 'md');
  const variant = createMemo(() => local.variant ?? 'primary');
  const thickness = createMemo(() => local.thickness ?? 4);
  const isDeterminate = createMemo(() => local.value !== undefined);
  const clampedValue = createMemo(() => Math.min(100, Math.max(0, local.value ?? 0)));

  const dimension = createMemo(() => SIZE_MAP[size()]);
  const center = createMemo(() => dimension() / 2);
  const radius = createMemo(() => center() - thickness() / 2);
  const circumference = createMemo(() => 2 * Math.PI * radius());
  const offset = createMemo(() => circumference() * (1 - clampedValue() / 100));

  const viewBox = createMemo(() => `0 0 ${String(dimension())} ${String(dimension())}`);

  const wrapperClass = createMemo(() => classNames(styles.wrapper, sizeClassByValue[size()], local.class));

  const svgClass = createMemo(() => classNames(styles.svg, !isDeterminate() && styles.indeterminate));

  const barClass = createMemo(() =>
    classNames(styles.bar, variantClassByValue[variant()], !isDeterminate() && styles.indeterminateBar),
  );

  return (
    <div
      {...rest}
      class={wrapperClass()}
      role="progressbar"
      aria-valuenow={isDeterminate() ? clampedValue() : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={local.label}
    >
      <svg viewBox={viewBox()} class={svgClass()}>
        <circle cx={center()} cy={center()} r={radius()} stroke-width={thickness()} class={styles.track} />
        <circle
          cx={center()}
          cy={center()}
          r={radius()}
          stroke-width={thickness()}
          stroke-linecap="round"
          stroke-dasharray={String(circumference())}
          stroke-dashoffset={isDeterminate() ? String(offset()) : undefined}
          class={barClass()}
        />
      </svg>
      <Show when={local.showValue && isDeterminate()}>
        <Text as="span" variant="caption" tone="secondary" class={styles.value}>
          {clampedValue()}%
        </Text>
      </Show>
    </div>
  );
};

export default CircularProgress;
