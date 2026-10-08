import * as React from 'react';
/**
 * Atom. The bordered field shell — height, border, radius, hover, focus ring, invalid/disabled/read-only states and
 * leading/trailing adornments. Put a native element with className "vui-control__input" inside.
 * Input, Textarea, Select trigger, NumberInput, PasswordInput, SearchInput and picker triggers all share it.
 */
export interface ControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** Height from --control-height-sm/md/lg (density- and pointer-aware). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Auto height for textarea */
  multiline?: boolean;
  /** Velvet icon name or node, inside the left edge */
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Text affix, e.g. "https://" or "€" */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Trailing slot for inline buttons (clear, reveal, stepper) */
  end?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Control(props: ControlProps): JSX.Element;
