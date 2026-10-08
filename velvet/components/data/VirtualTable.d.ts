import * as React from 'react';
export interface VirtualColumn<T = any> { key: string; label: React.ReactNode; /** Fixed px */ width?: number; /** Share of remaining space. @default 1 */ flex?: number; align?: 'left' | 'right'; render?: (row: T, index: number) => React.ReactNode }
/** Windowed table for 10k–1M rows: only visible rows (+ overscan) are in the DOM. Fixed row height. ↑↓ PageUp/Down Home End keep the focused row in view. Footer reports the visible range. */
export interface VirtualTableProps<T = any> {
  columns: VirtualColumn<T>[];
  rows: T[];
  /** px. @default 40 */
  rowHeight?: number;
  /** Viewport px. @default 400 */
  height?: number;
  /** @default 8 */
  overscan?: number;
  rowKey?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}
export declare function VirtualTable<T = any>(props: VirtualTableProps<T>): JSX.Element;
