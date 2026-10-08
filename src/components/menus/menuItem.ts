import type { JSX } from 'solid-js';

export interface MenuItem {
  label?: JSX.Element;
  /** Glyph name or node. */
  icon?: JSX.Element;
  description?: JSX.Element;
  /** Display-only hint, e.g. "⌘D". */
  shortcut?: string;
  onSelect?: () => void;
  /** Destructive: red text, red hover. */
  danger?: boolean;
  disabled?: boolean;
  /** Makes it a menuitemcheckbox with a check column. */
  checked?: boolean;
  /** Keep the menu open after selecting (checkbox lists). */
  keepOpen?: boolean;
  /** Renders a separator line (other fields ignored). */
  divider?: boolean;
  /** Renders a small group heading (other fields ignored). */
  section?: string;
}

export type MenuItemKind = 'divider' | 'section' | 'item';

export const menuItemKind = (item: MenuItem): MenuItemKind =>
  item.divider ? 'divider' : item.section ? 'section' : 'item';

/** Items that can take the active descendant and be chosen. */
export const isActionable = (item: MenuItem): boolean => menuItemKind(item) === 'item' && !item.disabled;
