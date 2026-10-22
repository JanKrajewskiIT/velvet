import * as React from 'react';
export interface ContributionItem { label: React.ReactNode; value: number }
/** Diverging bars from a zero axis — feature contributions, attribution, P&L by factor. Keeps the sign (Meter does not). */
export interface ContributionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ContributionItem[];
  /** Scale max (absolute). Defaults to the largest |value| */
  max?: number;
  unit?: string;
  digits?: number;
  /** Sort by |value| descending */
  sort?: boolean;
  /** Label column width. @default 180 */
  labelWidth?: number | string;
}
export declare function ContributionBar(props: ContributionBarProps): JSX.Element;
