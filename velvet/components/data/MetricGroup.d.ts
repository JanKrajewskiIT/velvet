import * as React from 'react';
export interface MetricItem { label: React.ReactNode; value: React.ReactNode; /** Colour value by market direction */ dir?: 'up' | 'down' | 'flat' }
/** Compact grid of small KPIs (value over caption). Lighter than Stat — for cards, calculators and summaries. */
export interface MetricGroupProps extends React.HTMLAttributes<HTMLDListElement> {
  items: MetricItem[];
  /** Fixed column count; otherwise auto-fit by minWidth */
  columns?: number;
  /** @default 120 */
  minWidth?: number;
  size?: 'sm' | 'md' | 'lg';
  /** subtle = tinted panel background */
  variant?: 'plain' | 'subtle';
}
export declare function MetricGroup(props: MetricGroupProps): JSX.Element;
