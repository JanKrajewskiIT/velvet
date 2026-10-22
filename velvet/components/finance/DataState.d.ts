import * as React from 'react';
/** Data freshness / availability. Distinguishes "nothing happened" (empty) from "we could not check" (unavailable/partial). Unavailable data is never shown as zero. */
export interface DataStateProps extends React.HTMLAttributes<HTMLElement> {
  state?: 'fresh' | 'delayed' | 'stale' | 'partial' | 'unavailable' | 'empty';
  /** Override the default title */
  label?: React.ReactNode;
  /** Reason, shown in block variant */
  detail?: React.ReactNode;
  /** Provider / feed, e.g. "Stooq · EOD" */
  source?: React.ReactNode;
  /** Observation time, e.g. "14:32:07" */
  asOf?: React.ReactNode;
  /** inline = dot + text (headers, cells) · block = placeholder for a whole panel. @default 'inline' */
  variant?: 'inline' | 'block';
  action?: React.ReactNode;
}
export declare function DataState(props: DataStateProps): JSX.Element;
