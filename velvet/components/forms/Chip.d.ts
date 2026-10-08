import * as React from 'react';
/**
 * Selectable pill — one option of a filter / tag set. ChipGroup, DualFilterBar and FilterBar render it.
 * Selected chips gain a check (springs in) and brand tint. For a removable token use Tag; for a menu trigger use MenuChip.
 */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pressed state. Omit for a plain action chip (no aria-pressed). */
  selected?: boolean;
  /** Leading glyph — hidden while the check shows */
  icon?: string | React.ReactNode;
  /** Trailing count pill */
  count?: number | string;
  /** Spring-in check on select. @default true */
  check?: boolean;
  /** Label colour — leading swatch that fills with a check when selected; tints border/ground. Any CSS colour. */
  color?: string;
  /** Dashed outline — the "create new" chip at the end of a set */
  dashed?: boolean;
  /** sm 28 · md 32. @default 'md' */
  size?: 'sm' | 'md';
  /** 'radio' / 'checkbox' switch aria-pressed to aria-checked */
  role?: string;
}
export declare function Chip(props: ChipProps): JSX.Element;
