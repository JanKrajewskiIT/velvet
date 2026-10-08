import * as React from 'react';
/**
 * Conversion funnel — centred bars that narrow step by step, value + share of the first step on the right, and a conversion / drop-off line between steps.
 * The hatched ghost shows where the previous step was, so the loss is visible. Hover or Tab through steps to focus one; each step reads its numbers to screen readers.
 */
export interface FunnelChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  /** @default compact (1.2k) */
  format?: (v: number) => string;
  /** Lightens step by step. @default 'var(--dv-1)' */
  color?: string;
  /** @default true */
  showConversion?: boolean;
  /** Conversion % against the previous step or the first. @default 'previous' */
  relativeTo?: 'previous' | 'first';
  label?: string;
  className?: string;
}
export declare function FunnelChart(props: FunnelChartProps): JSX.Element;
