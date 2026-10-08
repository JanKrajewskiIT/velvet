import * as React from 'react';
export interface BottomNavItem { value: string; label: string; icon: string; href?: string; /** Number/short text → Count; true → Dot */ badge?: number | string | boolean }
/** Mobile tab bar: 3–5 destinations (icon + label, active = brand colour + filled icon twin when one exists: home, bell, user, folder, bookmark, heart, message-square, star) with an optional elevated centre action. fixed pins it to the viewport bottom with safe-area padding. Hide Sidebar on mobile when using it. */
export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string, e: any) => void;
  /** Elevated round centre button (e.g. Create). Inserted in the middle of items. */
  action?: { label: string; icon?: string; onClick?: () => void };
  /** @default true */
  fixed?: boolean;
  label?: string;
  className?: string;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;
