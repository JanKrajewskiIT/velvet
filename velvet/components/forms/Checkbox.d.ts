import * as React from 'react';
/** Checkbox for multi-select and consent. Supports indeterminate. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
  /** Mixed state for parent rows */
  indeterminate?: boolean;
  /** sm = 16px box for dense rows. @default 'md' */
  size?: 'sm' | 'md';
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
