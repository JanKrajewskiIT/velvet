import type { JSX } from 'solid-js';

import type { QueryField } from '../patterns/QueryBuilder';
import type { RowKey } from './rowData';

export interface GridColumn<T extends object = object> {
  key: string;
  label: JSX.Element;
  /** px, resizable by dragging the header edge. @default 160 */
  width?: number;
  /** number = right-aligned, tabular, parsed on edit. */
  type?: 'text' | 'number';
  editable?: boolean;
  /** Edit with a select. */
  options?: string[];
  format?: (value: unknown) => JSX.Element;
  render?: (row: T) => JSX.Element;
  /** Start pinned (frozen) to the left. */
  pin?: 'left';
  /** Start hidden (re-enable in Columns). */
  hidden?: boolean;
  /** Can't be hidden / moved / unpinned in Columns. */
  locked?: boolean;
}

export interface GridRowChange {
  row: RowKey;
  key: string;
  value: unknown;
}

export interface DataGridProps<T extends object = object> {
  columns: GridColumn<T>[];
  rows: T[];
  /** @default 'id' */
  rowKey?: string;
  onRowsChange?: (rows: T[], change: GridRowChange) => void;
  /** Scroll area height in px. @default 360 */
  height?: number;
  /** Pin the first column when no column sets pin. @default true */
  stickyFirst?: boolean;
  /** @default true */
  rowNumbers?: boolean;
  selectable?: boolean;
  /** Selected row keys (controlled). */
  selected?: RowKey[];
  onSelectionChange?: (keys: RowKey[]) => void;
  /** Buttons shown in the toolbar while rows are selected. */
  bulkActions?: (rows: T[]) => JSX.Element;
  /** Expandable detail panel under a row. */
  renderDetail?: (row: T) => JSX.Element;
  /** Free-text filter across visible columns. */
  searchable?: boolean;
  /** @default localized "Filter N records…" */
  searchPlaceholder?: string;
  /** Enables the Filters popover (QueryBuilder). */
  filterFields?: QueryField[];
  /** Enables the Columns popover (ColumnManager). */
  columnManager?: boolean;
  /** Shows Export. Pass null for a built-in CSV download of the current view. */
  onExport?: ((rows: T[], columns: GridColumn<T>[]) => void) | null;
  /** Extra toolbar nodes on the right. */
  toolbarEnd?: JSX.Element;
  /** true = "Showing X of Y"; a node adds it on the right. */
  footer?: JSX.Element;
  class?: string;
}

export type CellPosition = { row: number; col: number };
export type EditMove = 'down' | 'right' | 'stay';
