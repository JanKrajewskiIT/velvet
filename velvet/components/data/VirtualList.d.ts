import * as React from 'react';
/**
 * Windowed list for thousands of rows — only the visible window (+ overscan) is in the DOM. Fixed itemHeight, or known variable
 * heights via getItemHeight (prefix-sum offsets, binary search). Invalid sizes fall back to safe defaults; duplicate keys warn and
 * fall back to key+index so rows never collide. Keyboard: ↑↓ PgUp PgDn Home End, Enter activates, Space/Enter selects.
 * Infinite loading: onEndReached fires once per growth when within endThreshold px of the bottom; loading shows a footer row.
 * For tabular data with columns use VirtualTable.
 */
export interface VirtualListProps<T = any> {
  items: T[];
  renderItem?: (item: T, index: number, state: { selected: boolean; focused: boolean }) => React.ReactNode;
  /** Row height px. @default 48 */
  itemHeight?: number;
  /** Per-row height when rows differ (must be known up front) */
  getItemHeight?: (item: T, index: number) => number;
  /** Viewport height px. @default 400 */
  height?: number;
  /** Rows rendered outside the viewport. @default 6 */
  overscan?: number;
  /** Space between rows px. @default 0 */
  gap?: number;
  /** Stable key. @default item.id ?? item.key ?? index */
  getKey?: (item: T, index: number) => string | number;
  /** listbox semantics + selected styling */
  selectable?: boolean;
  /** Selected key, or keys (multi) */
  selected?: string | number | (string | number)[];
  onSelect?: (key: string | number, item: T) => void;
  /** Click / Enter */
  onActivate?: (item: T, index: number) => void;
  onEndReached?: () => void;
  /** @default 200 */
  endThreshold?: number;
  loading?: boolean;
  loadingLabel?: string;
  empty?: React.ReactNode;
  /** Accessible name */
  label?: string;
  /** Hairline between rows */
  divided?: boolean;
  className?: string;
}
export declare function VirtualList<T = any>(props: VirtualListProps<T>): JSX.Element;
