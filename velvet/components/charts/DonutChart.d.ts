import * as React from 'react';
/** Part-to-whole donut with interactive legend: click an entry to exclude it and recut the rest (at least one stays); hover a segment or entry to see its share in the centre. Max ~6 slices — group the tail as "Other". */
export interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  /** px. @default 180 */
  size?: number;
  /** @default 22 */
  thickness?: number;
  format?: (v: number) => string;
  /** @default 'Total' */
  centerLabel?: string;
  label?: string;
  className?: string;
}
export declare function DonutChart(props: DonutChartProps): JSX.Element;
