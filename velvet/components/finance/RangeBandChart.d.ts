/** Actual series against an expected band (e.g. Monte Carlo P5–P95 with median). Handles negative values; points outside the band are marked. */
export interface RangeBandChartProps {
  /** Rows with label + lo/hi/mid/value keys */
  data: Array<Record<string, any> & { label: string }>;
  loKey?: string;
  hiKey?: string;
  midKey?: string;
  valueKey?: string;
  bandLabel?: string;
  midLabel?: string;
  valueLabel?: string;
  height?: number;
  format?: (v: number) => string;
  label?: string;
  className?: string;
}
export declare function RangeBandChart(props: RangeBandChartProps): JSX.Element;
