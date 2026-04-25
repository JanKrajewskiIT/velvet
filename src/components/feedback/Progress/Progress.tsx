import { createMemo, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Progress.module.css';

interface ProgressProps {
  value?: number;
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
}

const sizeClassByValue: Record<NonNullable<ProgressProps['size']>, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const variantClassByValue: Record<NonNullable<ProgressProps['variant']>, string | undefined> = {
  primary: styles.primary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
};

const Progress = (props: Props<ProgressProps>) => {
  const [local, rest] = splitProps(props, ['value', 'variant', 'size', 'label', 'showValue', 'class']);
  const variant = createMemo(() => local.variant ?? 'primary');
  const size = createMemo(() => local.size ?? 'md');
  const isDeterminate = createMemo(() => local.value !== undefined);
  const clampedValue = createMemo(() => Math.min(100, Math.max(0, local.value ?? 0)));

  const trackClass = createMemo(() => classNames(styles.track, sizeClassByValue[size()], local.class));

  const fillClass = createMemo(() =>
    classNames(styles.fill, variantClassByValue[variant()], !isDeterminate() && styles.indeterminate),
  );

  return (
    <div {...rest} class={trackClass()}>
      <Show when={local.label || local.showValue}>
        <div class={styles.header}>
          <Show when={local.label}>
            <Text as="span" variant="caption" tone="secondary" class={styles.label}>
              {local.label}
            </Text>
          </Show>
          <Show when={local.showValue && isDeterminate()}>
            <Text as="span" variant="caption" tone="muted" class={styles.value}>
              {clampedValue()}%
            </Text>
          </Show>
        </div>
      </Show>
      <div
        class={styles.trackBar}
        role="progressbar"
        aria-valuenow={isDeterminate() ? clampedValue() : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          class={fillClass()}
          style={isDeterminate() ? { '--fill-percent': `${String(clampedValue())}%` } : undefined}
        />
      </div>
    </div>
  );
};

export default Progress;
