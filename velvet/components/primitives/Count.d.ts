import * as React from 'react';
/**
 * Atom. Numeric pill for unread counts, tab/chip totals, cart items. Grid-centred with tabular figures so 1, 9 and 99+ all sit dead centre.
 * Inline next to a label, or anchored to an icon/avatar via Indicator. Tokens: --count-*.
 */
export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number | string;
  /** Above this, shows "max+". @default 99 */
  max?: number;
  /** brand (solid, default) · danger · success · inverse · neutral (subtle) · soft (brand tint). @default 'brand' */
  tone?: 'brand' | 'danger' | 'success' | 'inverse' | 'neutral' | 'soft';
  /** sm 16 · md 20 · lg 24. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render when value is 0. @default false */
  showZero?: boolean;
  /** Spring in on mount — use with key={value} to pop on change */
  pop?: boolean;
  /** Accessible text, e.g. "3 unread" */
  label?: string;
}
export declare function Count(props: CountProps): JSX.Element | null;
