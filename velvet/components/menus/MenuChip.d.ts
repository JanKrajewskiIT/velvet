import * as React from 'react';
/** Filter chip that opens a single-choice menu — "Status: Open ▾". Tinted when a value is set. Use in filter bars; for always-visible options use ChipGroup. */
export interface MenuChipProps {
  /** Dimension name — "Status" */
  label: string;
  options: Array<string | { value: string; label: string; icon?: string }>;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Adds an "Any" item that clears. @default true */
  allowClear?: boolean;
  /** @default 'Any' */
  clearLabel?: string;
  icon?: string;
  className?: string;
}
export declare function MenuChip(props: MenuChipProps): JSX.Element;
