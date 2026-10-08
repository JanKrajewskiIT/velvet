import * as React from 'react';
export interface TransferItem {
  value: string;
  label: React.ReactNode;
  description?: string;
  /** Right-aligned secondary text (level, count, team) */
  meta?: React.ReactNode;
  /** Initials / <img> in a round lead slot */
  avatar?: React.ReactNode;
  /** Velvet icon name in a square lead slot */
  icon?: string;
  /** Source list is grouped by this (sticky group headers) */
  group?: string;
  /** Extra search text that is not shown */
  keywords?: string;
  disabled?: boolean;
}
/**
 * Pick an ordered subset from a long pool (required skills, team members, permissions, columns). The value is the ordered
 * array of values in the right list.
 * Per-panel search with match highlight · grouped source list · click / Shift-click range / ⌘A select · double-click or Enter moves ·
 * drag items between panels (drags every checked item) · orderable: drag within the right list or ⌥↑ / ⌥↓ · optional max with meter.
 * Duplicate values are reported and block transfer. Stacks vertically under 640px.
 */
export interface TransferListProps {
  items: TransferItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** @default ['Available', 'Selected'] */
  titles?: [string, string];
  /** List height in px. @default 280 */
  height?: number;
  /** Accessible group name */
  label?: string;
  /** @default true */
  searchable?: boolean;
  searchPlaceholder?: [string, string];
  /** Right list can be reordered (drag or ⌥↑↓). @default false */
  orderable?: boolean;
  /** Max items in the right list — shows a meter, blocks adding past it. */
  max?: number;
  /** Group the source list by item.group. @default true */
  groupBy?: boolean;
  emptyText?: [React.ReactNode, React.ReactNode];
  /** Footer move-button labels. @default ['Add', 'Remove'] */
  moveLabels?: [string, string];
  /** Custom row body (checkbox + grip stay). */
  renderItem?: (item: TransferItem, state: { query: string; selected: boolean }) => React.ReactNode;
  className?: string;
}
export declare function TransferList(props: TransferListProps): JSX.Element;
