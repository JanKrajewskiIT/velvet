import * as React from 'react';
/**
 * Atom. One row inside any listbox or menu — icon, label, description, shortcut, check, active/selected/danger/disabled.
 * Menu items, Select options, Autocomplete and CommandPalette rows all share this row (tokens: --option-*).
 */
export interface OptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Velvet icon name or node */
  icon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** e.g. "⌘K" */
  shortcut?: React.ReactNode;
  selected?: boolean;
  /** Keyboard-highlighted (aria-activedescendant target) */
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  /** Reserve a leading check column and show it when selected */
  showCheck?: boolean;
  /** @default 'option' — use 'menuitem' / 'menuitemcheckbox' inside menus */
  role?: 'option' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  children?: React.ReactNode;
}
export declare function Option(props: OptionProps): JSX.Element;
