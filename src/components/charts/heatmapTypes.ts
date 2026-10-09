export interface HeatmapPoint {
  /** 'YYYY-MM-DD' or Date. Duplicates on one day are summed. */
  date: string | Date;
  value: number;
}

export interface HeatmapCell {
  date: string;
  value: number;
}

export interface HeatmapProps {
  data: HeatmapPoint[];
  /** @default 20 */
  weeks?: number;
  /** Last day shown. @default latest date in data (or today) */
  end?: string | Date;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStart?: 0 | 1;
  /** Month / weekday / date names. @default the active locale */
  locale?: string;
  /** Group name, shown after the total. @default localized "Activity" */
  label?: string;
  /** e.g. "sessions" — used in total, tooltip and aria labels. @default localized "Value" in the tooltip */
  unit?: string;
  /** @default value.toLocaleString(locale) */
  format?: (v: number) => string;
  /** Level colours, index 0 = empty. @default HEATMAP_COLORS */
  colors?: string[];
  /** Fixed lower bounds for levels 2…n-1 (any value > 0 is level 1). Default scales to the max in range. */
  thresholds?: number[];
  /** Max cell size in px — the grid is fluid below that. @default 16 */
  cellMax?: number;
  /** @default true */
  showTotal?: boolean;
  /** @default true */
  showLegend?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  class?: string;
}

export type HeatmapConfig = HeatmapProps &
  Required<Pick<HeatmapProps, 'weeks' | 'weekStart' | 'colors' | 'cellMax' | 'showTotal' | 'showLegend'>>;
