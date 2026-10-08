import * as React from 'react';
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Velvet icon name shown before the label */
  icon?: string;
  /** Secondary line under the label */
  description?: string;
}
/** Custom listbox select with a styled dropdown menu. Keyboard: ↑ ↓ Enter Esc. Opens upward near the viewport bottom. */
export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Options as strings or {value,label,icon,description,disabled} */
  options?: Array<string | SelectOption>;
  /** Shown when nothing is selected. @default 'Select…' */
  placeholder?: string;
  iconLeft?: string | React.ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Adds a hidden input for form submission */
  name?: string;
  /** Controlled value */
  value?: string;
  defaultValue?: string;
  /** Called with the new value */
  onValueChange?: (value: string) => void;
  /** Native-like: receives { target: { value, name } } */
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  /** Accessible name when there is no visible label (inline use in QueryBuilder rows, table cells, toolbars). */
  'aria-label'?: string;
}
export declare function Select(props: SelectProps): JSX.Element;
