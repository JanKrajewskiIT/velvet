import * as React from 'react';
export interface RadarAxis { key: string; label: string; /** Axis maximum; defaults to chart max or the largest value */ max?: number; }
export interface RadarSeries { label: string; values: Record<string, number>; /** Defaults to --dv-N in order */ color?: string; }
/**
 * Compares 1–3 profiles across 5–8 dimensions — skill profiles, product scores, team health. Legend toggles series,
 * hovering a vertex dims the others and shows the value. Over 3 series or 8 axes, use a BarChart instead.
 */
export interface RadarChartProps {
  axes: RadarAxis[];
  series: RadarSeries[];
  /** Square px size (scales down to fit). @default 300 */
  size?: number;
  /** Concentric rings. @default 4 */
  levels?: number;
  /** Shared maximum for every axis */
  max?: number;
  format?: (v: number) => string;
  /** @default true */
  showLegend?: boolean;
  /** Tinted area under each series. @default true */
  fill?: boolean;
  /** Accessible name — values are appended automatically */
  label?: string;
  className?: string;
}
export declare function RadarChart(props: RadarChartProps): JSX.Element;
