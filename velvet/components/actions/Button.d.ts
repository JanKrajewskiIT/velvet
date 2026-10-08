import * as React from 'react';
/**
 * Primary action trigger. One primary per view; secondary/ghost for the rest.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `dashed` = low-key "+ Add …" affordance; with `block` it becomes the add-row at the end of a list/table. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'link' | 'dashed';
  /** @default 'md' (40px; 44px on touch) */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Velvet icon name (e.g. "plus") or a node */
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  /** Shows spinner and disables */
  loading?: boolean;
  /** Full width */
  block?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
