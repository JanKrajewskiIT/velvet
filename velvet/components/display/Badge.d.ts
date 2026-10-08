import * as React from 'react';
/** Small non-interactive status or count label. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** @default 'soft' */
  variant?: 'soft' | 'solid' | 'outline';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot */
  dot?: boolean;
  /** Pulsing dot — live / streaming / analysing states. Use with dot. Static under reduced motion. */
  pulse?: boolean;
  /** Leading glyph (ignored when dot is set) */
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
