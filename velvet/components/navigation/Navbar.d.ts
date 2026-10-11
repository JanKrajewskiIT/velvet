import * as React from 'react';
export interface NavbarItem { id: string; label: string; /** Velvet icon name (required for variant="menubar") */ icon?: string; href?: string }
/** Top app bar. variant="links" (default): brand · text links · actions; tone="brand" paints it brand-coloured. variant="menubar": brand-filled 3-column bar — full logo (+ optional current-page label) · centred ICON menu — sliding glass indicator (the active icon drops into a ring that hangs below the bar) · actions: NotificationCenter, SearchTrigger (→ CommandPalette), NavbarUser, NavbarLocale all restyle for the brand fill. Both collapse to a burger under 720px, or always with condensed. Leave ~14px of space below a menubar navbar for the indicator. */
export interface NavbarProps {
  /** @default 'links' */
  variant?: 'links' | 'menubar';
  brand?: React.ReactNode;
  /** menubar: the brand mark, rendered bare on the bar — pass the full lockup, e.g. <BrandLogo brand="recron" tone="inverse" size={28} />. A string renders as display-font wordmark. */
  logo?: React.ReactNode;
  /** menubar: makes the logo a home link */
  logoHref?: string;
  onLogoClick?: () => void;
  items?: NavbarItem[];
  /** id of the current item */
  active?: string;
  /** Called with the item id; the link's default navigation is cancelled */
  onNavigate?: (id: string) => void;
  /** Right-hand slot */
  actions?: React.ReactNode;
  /** menubar: show the current item's label next to the logo. @default true */
  showActiveLabel?: boolean;
  /** menubar: override the label text */
  activeLabel?: React.ReactNode;
  /** Force the mobile layout (burger + overlay) at any width */
  condensed?: boolean;
  /** links only. @default 'default' */
  tone?: 'default' | 'brand';
  sticky?: boolean;
  /** Landmark name. @default 'Main' */
  label?: string;
  className?: string;
}
export declare function Navbar(props: NavbarProps): JSX.Element;
/** Glass locale pill for the menubar navbar's actions slot. */
export interface NavbarLocaleProps { value?: string; onClick?: () => void; label?: string }
export declare function NavbarLocale(props: NavbarLocaleProps): JSX.Element;
import type { MenuItem } from '../menus/Menu';
/** Account control for the menubar's actions slot. Default: avatar + first name + chevron pill → Menu (name hides under 960px). compact: avatar-only circle → account panel — identity header (name, email, meta), link list, Light/Dark/System theme switch, Sign out. */
export interface NavbarUserProps { name?: string; src?: string; /** Menu items (default) or panel links (compact — label, icon, onSelect, shortcut). Sections/dividers ignored in compact. */ items: MenuItem[]; /** @default true */ showName?: boolean; /** Avatar-only trigger → account panel. @default false */ compact?: boolean; /** compact: shown under the name */ email?: string; /** compact: small third line, e.g. role or plan */ meta?: React.ReactNode; /** compact: current theme for the switch */ theme?: 'light' | 'dark' | 'system'; /** compact: renders the theme switch when set */ onThemeChange?: (t: 'light' | 'dark' | 'system') => void; /** compact: renders the Sign out footer when set */ onSignOut?: () => void; label?: string; width?: number }
export declare function NavbarUser(props: NavbarUserProps): JSX.Element;
