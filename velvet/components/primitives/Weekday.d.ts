import * as React from 'react';
/** Atom. Short weekday label (overline type) for date grids. Pair with weekdayNames(locale, weekStartsOn, length) from primitives/date.js. */
export interface WeekdayProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'span' */
  as?: keyof JSX.IntrinsicElements;
  /** Brand colour for the current day */
  today?: boolean;
  children?: React.ReactNode;
}
export declare function Weekday(props: WeekdayProps): JSX.Element;
