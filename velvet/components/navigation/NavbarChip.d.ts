import * as React from 'react';
/** Pill in the Navbar actions area — balance/credits counter, account/environment switcher, privacy toggle. on-color for the brand menubar, surface for light bars. */
export interface NavbarChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  /** @default 'on-color' */
  tone?: 'on-color' | 'surface';
  /** Round icon-only button; label becomes aria-label/title */
  iconOnly?: boolean;
  /** Below 1280px show only the icon (text moves to the tooltip) — use for wide chips next to a 5+ item menubar */
  collapse?: boolean;
  /** Accessible name (required with iconOnly) */
  label?: string;
  pressed?: boolean;
}
export declare function NavbarChip(props: NavbarChipProps): JSX.Element;
