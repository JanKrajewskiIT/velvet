import * as React from 'react';
import { ChartSeries } from './BarChart';
/** Line / area chart with crosshair. Mouse, or focus + ←→ Home End, moves the crosshair; the value is announced. "Table" toggle shows the same data as an accessible table with period-over-period Δ. */
export interface LineChartProps {
  data: Array<{ label: string; [key: string]: any }>;
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  format?: (v: number) => string;
  /** Gradient fill under the first series. @default true */
  area?: boolean;
  /** @default true */
  curved?: boolean;
  /** Axis starts at 0 (default). false fits the axis to the data — use for equity / price levels. Negative values are always supported. @default true */
  includeZero?: boolean;
  /** Start in table view */
  showTable?: boolean;
  label?: string;
  className?: string;
}
export declare function LineChart(props: LineChartProps): JSX.Element;
