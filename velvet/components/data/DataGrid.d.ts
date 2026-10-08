import * as React from 'react';
import type { QueryField } from '../patterns/QueryBuilder';
export interface GridColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** px, resizable by dragging the header edge. @default 160 */
  width?: number;
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
  /** Can't be hidden / moved / unpinned in Columns */
  locked?: boolean;
}
/**
 * Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits,
 * Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header.
 * Optional layers, each one prop: toolbar search (searchable), Filters popover with a QueryBuilder (filterFields),
 * Columns popover with ColumnManager — show/hide, reorder, freeze (columnManager), Export (onExport; null = CSV download),
 * row checkboxes with select-all + bulk bar (selectable, bulkActions; Space toggles), expandable detail rows (renderDetail; Enter on a
 * read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer.
 * Use Table for simple read-only lists.
 */
export interface DataGridProps<T = any> {
  columns: GridColumn<T>[];
  rows: T[];
  /** @default 'id' */
  rowKey?: string;
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
