import type { JSX } from 'solid-js';

import type { MenuItem } from '../menus/menuItem';
import type { NavbarChipProps } from '../navigation/NavbarChip';

export interface ContextItem {
  id: string;
  /** Use a factory for rich content: the chip and menu need separate Solid nodes. */
  label?: string | (() => JSX.Element);
  description?: JSX.Element;
  icon?: string;
  tone?: 'neutral' | 'info' | 'warning' | 'danger';
}

export type ContextTemplate<T> = T | ((next: ContextItem, current: ContextItem) => T);

export interface ContextSwitcherProps {
  /** Context ids must be unique. */
  items: readonly ContextItem[];
  value?: string;
  onValueChange?: (id: string, item: ContextItem) => void;
  confirmWhen?: (next: ContextItem, current: ContextItem) => boolean;
  confirmTitle?: ContextTemplate<JSX.Element>;
  confirmDescription?: ContextTemplate<JSX.Element>;
  confirmLabel?: ContextTemplate<string>;
  cancelLabel?: ContextTemplate<string>;
  /** @default 'danger' */
  confirmTone?: 'primary' | 'danger';
  sectionLabel?: string;
  extraItems?: readonly MenuItem[];
  /** @default 'on-color' */
  tone?: NavbarChipProps['tone'];
  icon?: JSX.Element;
  label?: string;
  /** @default 300 */
  width?: number;
  /** @default 'end' */
  align?: 'start' | 'end';
  children?: JSX.Element;
  class?: string;
}
