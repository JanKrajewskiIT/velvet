import * as React from 'react';
/** App navigation spine. variant="floating" (default): raised card with border, radius and shadow; "docked": full-height panel with a right border. Header = brand + ⇇ collapse toggle (separated by a divider). Expanded (--sidebar-width) ⇄ 64px icon rail on the same element: labels/counts/caret hide, section labels become short dividers, counts become a dot, hover shows a tooltip. Single active item = soft brand fill. NavItem with subItems = animated accordion. */
export interface SidebarProps {
  /** Logo or wordmark — hidden in the rail when the toggle is shown */
  brand?: React.ReactNode;
  /** Compact mark shown in the rail when there is no toggle */
  brandCollapsed?: React.ReactNode;
  /** Pinned to the bottom — e.g. avatar + sign out */
  footer?: React.ReactNode;
  collapsed?: boolean;
  /** Shows the collapse/expand toggle in the header */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** @default 'floating' */
  variant?: 'floating' | 'docked';
  className?: string;
  children?: React.ReactNode;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
export interface NavSubItem { id?: string; label: React.ReactNode; active?: boolean; href?: string; onClick?: () => void }
/** Single navigation link inside Sidebar. With subItems it becomes an accordion parent (caret rotates 90°); clicking it in the rail expands the sidebar first. */
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  /** Current page */
  active?: boolean;
  /** Mono count pill; solid brand when active; a dot in the rail */
  count?: React.ReactNode;
  /** Any trailing node (prefer count) */
  end?: React.ReactNode;
  /** Renders an <a> when set (ignored with subItems) */
  href?: string;
  /** Nested links — opens by default when one is active */
  subItems?: NavSubItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
/** Small uppercase group label between NavItems; a short divider in the rail. */
export interface NavSectionProps { children?: React.ReactNode }
export declare function NavSection(props: NavSectionProps): JSX.Element;
