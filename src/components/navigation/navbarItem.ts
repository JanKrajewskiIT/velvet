import type { JSX } from 'solid-js';

export interface NavbarItem {
  id: string;
  label: string;
  /** Velvet icon name or a custom node; required for variant="menubar". */
  icon?: JSX.Element;
  href?: string;
}

/** Items without an explicit `href` link to their own id as a fragment. */
export const navbarHref = (item: NavbarItem): string => item.href ?? `#${item.id}`;
