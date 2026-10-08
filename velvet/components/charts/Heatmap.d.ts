/** Calendar density grid — "how much, when" (sessions, contributions, uptime). Weeks are columns, weekdays rows; colour steps come from --dv-seq-* so it re-themes. Hover or arrow-key through days (←→ week, ↑↓ day, Home/End); each cell has a full spoken label. Pair with Sparkline for trend and BarChart for comparison. */
export interface HeatmapPoint { /** 'YYYY-MM-DD' or Date. Duplicates on one day are summed. */ date: string | Date; value: number }
export interface HeatmapProps {
  data: HeatmapPoint[];
  /** @default 20 */
  weeks?: number;
  /** Last day shown. @default latest date in data (or today) */
  end?: string | Date;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStart?: 0 | 1;
  /** Month / weekday / date names. @default 'en' */
  locale?: string;
  /** Group name, shown after the total. @default 'Activity' */
  label?: string;
  /** e.g. "sessions" — used in total, tooltip and aria labels */
  unit?: string;
  format?: (v: number) => string;
  /** Level colours, index 0 = empty. @default HEATMAP_COLORS (sunken + 4 sequential steps) */
  colors?: string[];
  /** Fixed lower bounds for levels 2…n-1 (any value > 0 is level 1). Default scales to the max in range. */
  thresholds?: number[];
  /** Max cell size in px — grid is fluid below that. @default 16 */
  cellMax?: number;
  showTotal?: boolean;
  showLegend?: boolean;
  onCellClick?: (cell: { date: string; value: number }) => void;
  className?: string;
}
export declare function Heatmap(props: HeatmapProps): JSX.Element;
export declare const HEATMAP_COLORS: string[];
