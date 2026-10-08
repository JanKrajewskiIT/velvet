import * as React from 'react';
import type { Tone } from './Surface';
/** Atom. Track + fill for a known quantity (skill level, rating share, quota). Progress is the task-progress component; Meter is the bare bar. */
export interface MeterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  /** @default 100 */
  max?: number;
  /** Fill colour. @default brand */
  tone?: Tone;
  /** sm 4px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Split into N segments (password strength) */
  steps?: number;
  /** Sweep highlight while loading */
  shimmer?: boolean;
  /** Rating fill colour */
  rating?: boolean;
  /** Unknown amount — a 40% fill sweeps the track (Progress uses this) */
  indeterminate?: boolean;
  /** Accessible name — omit when a sibling already states the value */
  label?: string;
}
export declare function Meter(props: MeterProps): JSX.Element;
