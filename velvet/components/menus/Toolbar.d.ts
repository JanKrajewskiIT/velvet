import * as React from 'react';
export interface ToolbarItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  /** Toggle state → aria-pressed (and a check in the overflow menu) */
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
  /** Show the label next to the icon */
  showLabel?: boolean;
  divider?: boolean;
  /** Pushes following items to the right (dropped when overflowing) */
  spacer?: boolean;
}
/** Tool row that never wraps: items that don't fit collapse into a "⋯" overflow menu (ResizeObserver). ←→ / Home / End move focus. */
export interface ToolbarProps { items: ToolbarItem[]; /** Accessible name */ label?: string; className?: string }
export declare function Toolbar(props: ToolbarProps): JSX.Element;
