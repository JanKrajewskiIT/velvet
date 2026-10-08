import * as React from 'react';
import type { CardProps } from '../display/Card';
import type { Tone } from '../primitives/Surface';
/** KPI card built on Card: label, big value, delta badge, hint. `spark` adds a trend line (Stat trend). Other Card / Surface props pass through. */
export interface StatProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: string;
  /** Colour of the delta badge */
  tone?: 'success' | 'danger' | 'warning' | 'neutral';
  hint?: React.ReactNode;
  /** Category coding — Surface accent strip in this tone; also colours the sparkline */
  accent?: Tone;
  /** Recent values → small trend line under the number */
  spark?: number[];
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through */
  variant?: CardProps['variant'];
  hoverable?: CardProps['hoverable'];
  interactive?: CardProps['interactive'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
  as?: CardProps['as'];
}
export declare function Stat(props: StatProps): JSX.Element;
