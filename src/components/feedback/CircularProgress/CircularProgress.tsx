import { Show } from 'solid-js';

import type Props from '~/models/Props';

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

const CircularProgress = (props: Props<CircularProgressProps>) => {
  const size = () => props.size ?? 'md';
  const variant = () => props.variant ?? 'primary';
  const thickness = () => props.thickness ?? 4;
  const isDeterminate = () => props.value !== undefined;
  const clampedValue = () => Math.min(100, Math.max(0, props.value ?? 0));

  const dimension = () => SIZE_MAP[size()];
  const center = () => dimension() / 2;
  const radius = () => center() - thickness() / 2;
  const circumference = () => 2 * Math.PI * radius();
  const offset = () => circumference() * (1 - clampedValue() / 100);

  const viewBox = () => `0 0 ${dimension()} ${dimension()}`;

  const wrapperClass = () => `${styles.wrapper} ${styles[size()]} ${props.class ?? ''}`;

  const svgClass = () => `${styles.svg} ${isDeterminate() ? '' : styles.indeterminate}`;

  const barClass = () => `${styles.bar} ${styles[variant()]} ${isDeterminate() ? '' : styles.indeterminateBar}`;

  return (
    <div
      class={wrapperClass()}
      role="progressbar"
      aria-valuenow={isDeterminate() ? clampedValue() : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={props.label}
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
      <Show when={props.showValue && isDeterminate()}>
        <span class={styles.value}>{clampedValue()}%</span>
      </Show>
    </div>
  );
};

export default CircularProgress;
