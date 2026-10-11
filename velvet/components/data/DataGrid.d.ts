import * as React from 'react';
import type { QueryField, QueryGroup } from '../patterns/QueryBuilder';
import type { ColumnState } from './ColumnManager';
export interface GridColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** px, resizable by dragging the header edge. @default 160 */
  width?: number;
  /** Resize limits in px. @default min 64 */
  minWidth?: number;
  maxWidth?: number;
  /** number = right-aligned, tabular, parsed on edit */
  type?: 'text' | 'number';
  editable?: boolean;
  /** Edit with a select */
  options?: string[];
  format?: (value: any) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
  /** Start pinned (frozen) to the left */
  pin?: 'left';
  /** Start hidden (re-enable in Columns) */
  hidden?: boolean;
  /** Can't be hidden / moved / unpinned in Columns (shorthand for the three flags below = false) */
  locked?: boolean;
  /** @default true */
  hideable?: boolean;
  /** @default true */
  pinnable?: boolean;
  /** @default true */
  movable?: boolean;
}
/** Everything about how the grid is viewed — never the records or the selection. Plain JSON: safe to persist on the app side. */
export interface GridView {
  search: string;
  query: QueryGroup | null;
  sort: { key: string; dir: 'asc' | 'desc' } | null;
  /** Order, visibility and pin per column */
  columns: ColumnState[];
  /** Only columns the user resized */
  widths: Record<string, number>;
}
/**
 * Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits,
 * Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header.
 * Optional layers, each one prop: toolbar search (searchable), Filters popover with a QueryBuilder (filterFields),
 * Columns popover with ColumnManager — show/hide, reorder, freeze (columnManager), Export (onExport; null = CSV download),
 * row checkboxes with select-all + bulk bar (selectable, bulkActions; Space toggles), expandable detail rows (renderDetail; Enter on a
 * read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer.
 * View state (search, filters, sort, column order/visibility/pins, widths) is one GridView object — uncontrolled (defaultView) or
 * controlled (view + onViewChange); "Reset view" appears once it differs from the default. Saved views are reconciled to the current
 * columns (unknown keys dropped, new columns appended, widths clamped, ≥1 column always visible). Persisting views is the app's job.
 * Server data: manualFiltering / manualSorting keep the UI but skip local filtering/sorting — fetch, paginate and show loading yourself.
 * Use Table for simple read-only lists.
 */
export interface DataGridProps<T = any> {
  columns: GridColumn<T>[];
  rows: T[];
  /** Unique, stable record key — required to stay correct when rows are replaced, inserted or reordered (warns on missing/duplicate keys). @default 'id' */
  rowKey?: string;
  /** Controlled view state */
  view?: GridView;
  /** Initial (and reset) view; partial/saved views are reconciled to the columns */
  defaultView?: Partial<GridView>;
  onViewChange?: (view: GridView) => void;
  /** Search + Filters only update the view; rows are shown as given (server-side filtering) */
  manualFiltering?: boolean;
  /** Header sort only updates the view; rows are shown as given (server-side sorting) */
  manualSorting?: boolean;
  /** Total for the footer "of Y" when rows is one page of a larger set */
  rowCount?: number;
  onRowsChange?: (rows: T[], change: { row: any; key: string; value: any }) => void;
  /** Scroll area height in px. @default 360 */
  height?: number;
  /** Pin the first column when no column sets pin. @default true */
  stickyFirst?: boolean;
  /** @default true */
  rowNumbers?: boolean;
  selectable?: boolean;
  /** Selected row keys (controlled) */
  selected?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Buttons shown in the toolbar while rows are selected */
  bulkActions?: (rows: T[]) => React.ReactNode;
  /** Expandable detail panel under a row */
  renderDetail?: (row: T) => React.ReactNode;
  /** Free-text filter across visible columns */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Enables the Filters popover (QueryBuilder) */
  filterFields?: QueryField[];
  /** Enables the Columns popover (ColumnManager) */
  columnManager?: boolean;
  /** Shows Export. Pass null for a built-in CSV download of the current view. */
  onExport?: ((rows: T[], columns: GridColumn<T>[]) => void) | null;
  /** Extra toolbar nodes on the right */
  toolbarEnd?: React.ReactNode;
  /** true = "Showing X of Y"; a node adds it on the right */
  footer?: boolean | React.ReactNode;
  className?: string;
}
export declare function DataGrid<T = any>(props: DataGridProps<T>): JSX.Element;
/** The view a grid starts from (column defaults, empty search/filters, no sort). */
export declare function defaultGridView(columns: GridColumn[], opts?: { stickyFirst?: boolean; filterFields?: QueryField[] }): GridView;
/** Fit a saved or imported view onto the current columns. Use before trusting persisted JSON. */
export declare function reconcileGridView(view: unknown, columns: GridColumn[], opts?: { stickyFirst?: boolean; filterFields?: QueryField[] }): GridView;
