import * as React from 'react';
export interface TableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** Freeze the column to the left or right edge while the table scrolls horizontally. Any number may be pinned. */
  pin?: 'left' | 'right';
  /** Custom cell renderer */
  render?: (row: T) => React.ReactNode;
  /** Right-align + tabular numbers */
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide this column under 768px */
  hideOnMobile?: boolean;
  /** Header becomes a sort button (asc → desc → off) */
  sortable?: boolean;
  /** Value used for sorting when the cell is rendered */
  sortValue?: (row: T) => string | number;
}
export interface TableSort { key: string; dir: 'asc' | 'desc' }
/** Data table: toolbar (title · count · actions), sort, row selection (Shift-click selects a range) with bulk-action bar, drag-to-resize columns, expandable detail rows, sticky header, keyboard (↑↓ move · Space select · →/← expand · ⌘A all · Esc clear), skeleton loading, empty state. Framed on its own; borderless inside <Card padding="none">. */
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Unique key field. @default 'id' */
  rowKey?: string;
  selectable?: boolean;
  /** Selected row keys */
  selected?: Array<string | number>;
  onSelectedChange?: (keys: Array<string | number>) => void;
  /** Buttons shown in the bar that appears while rows are selected */
  bulkActions?: React.ReactNode;
  /** Controlled sort. If onSortChange is also set, rows are NOT sorted internally (server sort). */
  sort?: TableSort | null;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort | null) => void;
  /** Show skeleton rows */
  loading?: boolean;
  /** @default 4 */
  loadingRows?: number;
  /** Empty-state content — a string or an <EmptyState size="sm"> */
  empty?: React.ReactNode;
  /** Toolbar title (shows the row count next to it) */
  title?: React.ReactNode;
  /** Override the count shown next to the title */
  count?: React.ReactNode;
  /** Toolbar actions, right-aligned */
  toolbar?: React.ReactNode;
  /** Drag column edges to resize (double-click resets a column; ←/→ on the handle). Adds “Reset widths” to the toolbar once changed. */
  resizable?: boolean;
  /** Adds a chevron column; renders this below the row when expanded */
  renderExpanded?: (row: T) => React.ReactNode;
  /** Scroll height for the body, e.g. 360. Enables sticky header. */
  maxHeight?: number | string;
  /** @default true when maxHeight is set */
  stickyHeader?: boolean;
  className?: string;
}
export declare function Table<T = any>(props: TableProps<T>): JSX.Element;
