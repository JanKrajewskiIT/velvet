import { Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Progress.module.css';

interface ProgressProps {
  value?: number;
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
}

const Progress = (props: Props<ProgressProps>) => {
  const variant = () => props.variant ?? 'primary';
  const size = () => props.size ?? 'md';
  const isDeterminate = () => props.value !== undefined;
  const clampedValue = () => Math.min(100, Math.max(0, props.value ?? 0));

  const trackClass = () => `${styles.track} ${styles[size()]} ${props.class ?? ''}`;

  const fillClass = () => `${styles.fill} ${styles[variant()]} ${isDeterminate() ? '' : styles.indeterminate}`;

  return (
    <div class={trackClass()}>
      <Show when={props.label || props.showValue}>
        <div class={styles.header}>
          <Show when={props.label}>
            <span class={styles.label}>{props.label}</span>
          </Show>
          <Show when={props.showValue && isDeterminate()}>
            <span class={styles.value}>{clampedValue()}%</span>
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
        <div class={fillClass()} style={isDeterminate() ? { '--fill-percent': `${clampedValue()}%` } : undefined} />
      </div>
    </div>
  );
};

export default Progress;
