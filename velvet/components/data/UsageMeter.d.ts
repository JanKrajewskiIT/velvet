import * as React from 'react';
/** Labelled usage bar: label + "used / limit" + Meter + optional hint. Tone switches automatically at thresholds (70% warning, 90% danger) unless tone is set. */
export interface UsageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: number | null;
  max?: number;
  /** Appended to value and max, e.g. "%", "×", " PLN" */
  unit?: string;
  /** Replaces the "value / max" text */
  valueText?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** Fractions of max for warning / danger. @default [0.7, 0.9] */
  thresholds?: [number, number];
  size?: 'sm' | 'md';
  format?: (v: number) => string;
}
export declare function UsageMeter(props: UsageMeterProps): JSX.Element;
