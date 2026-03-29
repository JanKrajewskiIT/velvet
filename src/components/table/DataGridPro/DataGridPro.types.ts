import type { JSX } from 'solid-js';

import type { TabularSortDirection } from '~/utils/tabularData';

export type DataGridProSortDirection = TabularSortDirection;
export type DataGridProColumnPin = 'left' | 'right' | null;
export type DataGridProColumnPinning = Partial<Record<string, DataGridProColumnPin>>;

export interface DataGridProColumn<T> {
  key: keyof T & string;
  header: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  pinned?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => JSX.Element;
  sortAccessor?: (row: T) => string | number | boolean | Date | null | undefined;
  sortFn?: (a: T, b: T, direction: DataGridProSortDirection) => number;
  filterAccessor?: (row: T) => string | number | boolean | null | undefined;
  filterFn?: (row: T, query: string) => boolean;
}

export interface DataGridProSortState {
  key: string | null;
  direction: DataGridProSortDirection;
}

export interface DataGridProMessages {
  selectAllVisibleRowsLabel?: string;
  resizeColumnLabel?: (label: string) => string;
  noRowsLabel?: string;
  selectRowLabel?: (id: string) => string;
  rowsCountLabel?: (count: number) => string;
  selectedCountLabel?: (count: number) => string;
  clearSelectionLabel?: string;
  resetViewLabel?: string;
  columnsLabel?: string;
  columnVisibilityLabel?: string;
  resetColumnsLabel?: string;
}

export interface DataGridProProps<T> {
  data: T[];
  columns: DataGridProColumn<T>[];
  height?: number;
  rowHeight?: number;
  headerHeight?: number;
  overscan?: number;
  sortable?: boolean;
  striped?: boolean;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => string;
  selectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  filterable?: boolean;
  filterQuery?: string;
  defaultFilterQuery?: string;
  onFilterQueryChange?: (query: string) => void;
  filterPlaceholder?: string;
  filterFn?: (row: T, query: string) => boolean;
  manualFiltering?: boolean;
  sortKey?: string | null;
  sortDirection?: DataGridProSortDirection;
  onSortChange?: (state: DataGridProSortState) => void;
  manualSorting?: boolean;
  showToolbar?: boolean;
  reorderable?: boolean;
  columnOrder?: string[];
  defaultColumnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;
  columnVisibility?: Record<string, boolean>;
  defaultColumnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  columnPinning?: DataGridProColumnPinning;
  defaultColumnPinning?: DataGridProColumnPinning;
  onColumnPinningChange?: (pinning: DataGridProColumnPinning) => void;
  persistenceKey?: string;
  resetPersistenceLabel?: string;
  onPersistenceReset?: () => void;
  importSettingsLabel?: string;
  exportSettingsLabel?: string;
  persistedBadgeLabel?: string;
  defaultBadgeLabel?: string;
  messages?: DataGridProMessages;
}
