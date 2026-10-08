import * as React from 'react';
/** Radio for picking one of 2–5 visible options. Group with a shared name. */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** sm = 16px circle for dense rows. @default 'md' */
  size?: 'sm' | 'md';
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;
