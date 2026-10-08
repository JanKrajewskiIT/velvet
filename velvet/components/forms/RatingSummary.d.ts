import * as React from 'react';
/** Review summary: big average, read-only stars, total, and a per-star distribution. With onFilter the rows become toggle buttons (click the active row again to clear). */
export interface RatingSummaryProps {
  /** Votes per star, index 0 = 1★ … last = max★. Length sets the scale. e.g. [2, 3, 9, 41, 88] */
  counts: number[];
  /** Override; otherwise computed from counts */
  average?: number;
  /** Singular noun after the total. @default 'review' */
  noun?: string;
  /** Currently filtered star (controlled) */
  activeStar?: number | null;
  onFilter?: (star: number | null) => void;
  /** @default 'Rating breakdown' */
  label?: string;
  className?: string;
}
export declare function RatingSummary(props: RatingSummaryProps): JSX.Element;
