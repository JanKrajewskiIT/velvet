import * as React from 'react';
export interface ChipOption { value: string; label: React.ReactNode; count?: number; icon?: string; disabled?: boolean }
/** Toggle chips for tagging and filtering. Multi-select by default (value: string[]); multiple=false gives a deselectable single choice (value: string | null). Selected chips gain a check and brand tint. For a required single choice use OptionSwitcher. */
export interface ChipGroupProps {
  options: Array<string | ChipOption>;
  value?: string[] | string | null;
  defaultValue?: string[] | string | null;
  onValueChange?: (value: any) => void;
  /** @default true */
  multiple?: boolean;
  size?: 'sm' | 'md';
  /** Accessible group name */
  label?: string;
  className?: string;
}
export declare function ChipGroup(props: ChipGroupProps): JSX.Element;
