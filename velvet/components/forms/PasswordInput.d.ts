import * as React from 'react';
/** Password field with show/hide toggle and optional live strength meter (4 segments + label). */
export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** @default 'Password' */
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Show the strength meter — use on "create / change password" only, never on sign-in. */
  showStrength?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export declare function PasswordInput(props: PasswordInputProps): JSX.Element;
/** 0–4 score (−1 for empty): length ≥ 8, mixed case, digit, symbol, length ≥ 12. */
export declare function passwordScore(value: string): number;
