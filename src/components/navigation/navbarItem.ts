export interface NavbarItem {
  id: string;
  label: string;
  /** Velvet icon name (required for variant="menubar") */
  icon?: string;
  href?: string;
}

/** Items without an explicit `href` link to their own id as a fragment. */
export const navbarHref = (item: NavbarItem): string => item.href ?? `#${item.id}`;
