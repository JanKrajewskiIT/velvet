import * as React from 'react';
/** Switch for instant on/off settings (no Save needed). */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
  /** @default 'md' */
  size?: 'sm' | 'md';
}
export declare function Switch(props: SwitchProps): JSX.Element;
