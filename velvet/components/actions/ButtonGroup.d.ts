import * as React from 'react';
/**
 * Groups related Buttons / IconButtons. attached (default) joins them into one segmented control with shared borders —
 * toolbars, split buttons, pagination steppers. attached={false} spaces them with --space-2 — dialog footers, action rows.
 * For a single choice among options use OptionSwitcher or Tabs, not ButtonGroup.
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default true */
  attached?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Applied to every child that doesn't set its own */
  size?: 'sm' | 'md' | 'lg';
  /** aria-label for the group */
  label?: string;
  children?: React.ReactNode;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;
