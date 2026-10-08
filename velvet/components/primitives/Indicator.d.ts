import * as React from 'react';
/**
 * Atom. Anchors a Count or Dot to the corner of any element — icon, IconButton, Avatar, tab. Ring in --count-ring separates it from the host.
 * Use overlap="circle" for round hosts (avatars), "rect" for squares (icon buttons). Pair with an accessible label on the host.
 */
export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number or short text. 0 / null hides it. */
  count?: number | string | null;
  /** Show a dot instead of a number (unread, presence) */
  dot?: boolean;
  /** @default 99 */
  max?: number;
  /** Count tones (brand, danger, success, inverse, neutral, soft) or Dot tones (success, warning…). @default 'brand' */
  tone?: string;
  /** Count size. @default 'sm' */
  size?: 'sm' | 'md';
  /** @default 'top-end' */
  placement?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
  /** rect = corner of the box · circle = on the curve of a round host. @default 'rect' */
  overlap?: 'rect' | 'circle';
  /** Pull inside the host's bounds (for hosts with overflow:hidden) */
  inset?: boolean;
  /** Announces the indicator, e.g. "3 unread" */
  label?: string;
  children: React.ReactNode;
}
export declare function Indicator(props: IndicatorProps): JSX.Element;
