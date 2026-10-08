import * as React from 'react';
/** Set of ToggleButtons that share state. type="multiple": each independent (B / I / U). type="single": exactly one pressed, clicking the pressed one keeps it (view: grid / list / tree). ←→ move focus between buttons. */
export interface ToggleGroupProps {
  /** @default 'multiple' */
  type?: 'single' | 'multiple';
  /** string[] for multiple, string for single */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: any) => void;
  /** Joined segments with shared border. @default true */
  attached?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible group name */
  label?: string;
  className?: string;
  children: React.ReactNode;
}
export declare function ToggleGroup(props: ToggleGroupProps): JSX.Element;
