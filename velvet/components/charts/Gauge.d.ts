import * as React from 'react';
/**
 * Half-circle meter for one value against a range — utilisation, score, SLA, quota. role="meter".
 * thresholds recolour the arc once the value passes them and draw a notch on the track. Use Progress / Meter for linear progress, Stat for a bare number.
 */
export interface GaugeProps {
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  format?: (v: number) => string;
  /** Small suffix after the number — %, ms, GB */
  unit?: string;
  /** e.g. [{ value: 70, tone: 'warning' }, { value: 90, tone: 'danger' }] */
  thresholds?: Array<{ value: number; tone: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string }>;
  /** Arc colour below the first threshold. @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** sm 136 · md 188 · lg 244 px wide. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** min / max captions under the arc. @default true */
  showBounds?: boolean;
  className?: string;
}
export declare function Gauge(props: GaugeProps): JSX.Element;
