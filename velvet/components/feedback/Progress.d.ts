import * as React from 'react';
/** Linear progress for determinate tasks (upload, onboarding, quota) or indeterminate loading. */
export interface ProgressProps {
  value?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
  /** brand, semantic, or auto-free. Use warning/danger for quotas near the limit. */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  /** Custom value text — (v, max) => v + ' of ' + max + ' GB' */
  format?: (value: number, max: number) => string;
  className?: string;
}
export declare function Progress(props: ProgressProps): JSX.Element;
/** Circular progress with centred percentage. */
export interface ProgressRingProps { value?: number; max?: number; /** px @default 48 */ size?: number; stroke?: number; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'; showValue?: boolean; label?: string;
  /** progressbar (task) · meter (measured value) · img (score badge — label carries the value). @default 'progressbar' */
  role?: 'progressbar' | 'meter' | 'img';
  /** Custom centre content — replaces the % value (e.g. "82/100") */
  children?: React.ReactNode; className?: string }
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;
