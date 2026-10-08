import * as React from 'react';
/** Submit-time error summary: takes focus when errors appear, lists each problem as a link that focuses and scrolls to its field. Pair each field's error via Input's error prop (aria-describedby is wired). Put it at the top of the form. */
export interface ErrorSummaryProps {
  /** id = the field's input id */
  errors: Array<{ id: string; message: string }>;
  /** Default: "There are N problems to fix" */
  title?: React.ReactNode;
  /** @default true */
  focusOnShow?: boolean;
  className?: string;
}
export declare function ErrorSummary(props: ErrorSummaryProps): JSX.Element | null;
