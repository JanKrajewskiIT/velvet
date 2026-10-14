import type { JSX } from 'solid-js';

import type { RowKey, RowSort } from './rowData';

export type TableSort = RowSort;

export interface TableColumn<T extends object = object> {
  key: string;
  label: JSX.Element;
  /** Freeze the column to the left or right edge while the table scrolls horizontally. Any number may be pinned. */
  pin?: 'left' | 'right';
  /** Custom cell renderer. */
  render?: (row: T) => JSX.Element;
  /** Right-align + tabular numbers. */
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide this column under 768px. */
  hideOnMobile?: boolean;
  /** Header becomes a sort button (asc → desc → off). */
  sortable?: boolean;
  /** Value used for sorting when the cell is rendered. */
  sortValue?: (row: T) => string | number;
}

export interface TableProps<T extends object = object> {
  /** @default 'auto' */
  layout?: 'auto' | 'fixed';
  columns: TableColumn<T>[];
  rows: T[];
  /** Unique key field. @default 'id' */
  rowKey?: string;
  getRowId?: (row: T) => RowKey;
  dataKey?: string | number;
  selectable?: boolean;
  /** Selected row keys. */
  selected?: RowKey[];
  defaultSelected?: RowKey[];
  onSelectedChange?: (keys: RowKey[]) => void;
  /** Buttons shown in the bar that appears while rows are selected. */
  bulkActions?: JSX.Element;
  /** Controlled sort. If onSortChange is also set, rows are NOT sorted internally (server sort). */
  sort?: TableSort | null;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort | null) => void;
  /** Explicitly choose server sorting; omitted retains the legacy controlled-sort behavior. */
  manualSorting?: boolean;
  /** Show skeleton rows. */
  loading?: boolean;
  /** @default 4 */
  loadingRows?: number;
  /** Empty-state content — a string or an `<EmptyState size="sm">`. @default localized "Nothing here yet." */
  empty?: JSX.Element;
  /** Toolbar title (shows the row count next to it). */
  title?: JSX.Element;
  /** Override the count shown next to the title. */
  count?: JSX.Element;
  /** Toolbar actions, right-aligned. */
  toolbar?: JSX.Element;
  /** A native table row, usually TableAddRowAction; shown after records when not loading. */
  addRow?: JSX.Element;
  /** Drag column edges to resize (double-click resets a column; ←/→ on the handle). Adds “Reset widths” to the toolbar once changed. */
  resizable?: boolean;
  /** Adds a chevron column; renders this below the row when expanded. */
  renderExpanded?: (row: T) => JSX.Element;
  /** Scroll height for the body, e.g. 360. Enables sticky header. */
  maxHeight?: number | string;
  /** @default true when maxHeight is set */
  stickyHeader?: boolean;
  class?: string;
}

export type TableConfig<T extends object> = TableProps<T> &
  Required<Pick<TableProps<T>, 'rowKey' | 'selectable' | 'selected' | 'loading' | 'loadingRows' | 'resizable'>>;
