import * as React from 'react';
export interface ChartSeries { key: string; label: string; /** Defaults to --dv-N in order */ color?: string }
/** Vertical bar chart (grouped or stacked). Hover or focus + ←→ to read each group; tooltip shows every series. Responsive to container width. Colours come from the data-viz palette. */
export interface BarChartProps {
  /** [{ label: 'Mon', value: 12 }] or one key per series */
  data: Array<{ label: string; [key: string]: any }>;
  /** @default [{ key: 'value' }] */
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  stacked?: boolean;
  /** Axis + tooltip formatter. @default compact (1.2k) */
  format?: (v: number) => string;
  /** Accessible name */
  label?: string;
  /** Default: shown for 2+ series */
  showLegend?: boolean;
  className?: string;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
