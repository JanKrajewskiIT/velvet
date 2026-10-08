import * as React from 'react';
/** Text field with label, hint, icons, prefix/suffix and validation. Hint/error lane is fixed-height when `validate`, `reserveHint` or `showCount` is set, so errors never reflow the form. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  hint?: string;
  /** Controlled error message (overrides `validate`) */
  error?: string;
  optional?: boolean;
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  /** Text inside the field, before the value — "$", "velvet.app/" */
  prefix?: React.ReactNode;
  /** Text inside the field, after the value — "USD / mo", "kg" */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated Use Textarea. */
  multiline?: boolean;
  rows?: number;
  /** Focusable and selectable, not editable. Dashed border, secondary text. */
  readOnly?: boolean;
  /** Return an error string or undefined. Runs on blur, then on every change once touched. */
  validate?: (value: string) => string | undefined | null | false;
  /** Always reserve the 18px message lane (use in forms that validate on submit). */
  reserveHint?: boolean;
  /** Live "n / maxLength" counter, right of the hint. Requires maxLength. */
  showCount?: boolean;
  maxLength?: number;
}
export declare function Input(props: InputProps): JSX.Element;
