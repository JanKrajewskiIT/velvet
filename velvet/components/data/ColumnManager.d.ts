import * as React from 'react';
export interface ManagedColumn { key: string; label: React.ReactNode; /** Start hidden when false. @default true */ visible?: boolean; /** Start pinned */ pin?: 'left' | 'right'; /** Can't be hidden, moved or unpinned (e.g. Name) */ locked?: boolean; }
export interface ColumnState { key: string; visible: boolean; pin: 'left' | 'right' | null; }
/**
 * Table column settings: visibility (switch), order (drag the grip, or focus it and press ↑/↓ — moves cross section
 * boundaries), and freezing (pin button). Any number of columns can be pinned; sections are Pinned left · Columns ·
 * Pinned right (right appears with pinRight or when a column is already pinned right). Search appears past 8 columns.
 * Usually inside a Popover opened from a "Columns" button in the Table toolbar. Feed Table with ApplyColumns(columns, state)
 * — it orders left → middle → right and sets each column's pin so Table makes it sticky.
 */
export interface ColumnManagerProps {
  /** Source columns in their default order */
  columns: ManagedColumn[];
  value?: ColumnState[];
  defaultValue?: ColumnState[];
  onChange?: (state: ColumnState[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (state: ColumnState[]) => void;
  /** @default 'Columns' */
  title?: string;
  /** Offer a "Pinned right" section (actions, totals). @default false */
  pinRight?: boolean;
  /** Cap on pinned columns — pins beyond it are disabled with a hint */
  maxPinned?: number;
  /** Defaults to on when there are more than 8 columns */
  searchable?: boolean;
  className?: string;
}
export declare function ColumnManager(props: ColumnManagerProps): JSX.Element;
/** Visible columns in display order (left pins → middle → right pins), each with pin set */
export declare function ApplyColumns<T extends { key: string }>(columns: T[], state: ColumnState[]): (T & { pin?: 'left' | 'right' })[];
