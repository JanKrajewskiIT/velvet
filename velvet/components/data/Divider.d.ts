import * as React from 'react';
/** Hairline separator, optionally with a centered label ("or"). */
export interface DividerProps {
  label?: React.ReactNode;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
export declare function Divider(props: DividerProps): JSX.Element;
