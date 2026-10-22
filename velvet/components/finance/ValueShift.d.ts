import * as React from 'react';
/** "expected → actual" (or before → after) with the result highlighted when it got worse or better. */
export interface ValueShiftProps<T = number> extends React.HTMLAttributes<HTMLSpanElement> {
  from: T;
  to: T;
  format?: (v: T) => React.ReactNode;
  /** Return true when the change is a deterioration → danger colour */
  worse?: (from: T, to: T) => boolean;
  /** Return true when the change is an improvement → success colour */
  better?: (from: T, to: T) => boolean;
  /** Screen-reader prefix */
  label?: string;
}
export declare function ValueShift<T = number>(props: ValueShiftProps<T>): JSX.Element;
