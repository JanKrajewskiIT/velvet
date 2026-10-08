import * as React from 'react';
export interface SwitcherOption { value: string; label?: React.ReactNode; icon?: string; disabled?: boolean }
/** Required single choice among 2–5 options (radiogroup; ←→ move + select). track = segmented tool track (view modes, alignment, icon tools) · chips = separate pills (plan, period, size) · tiles = icon-first square tiles, icon above label (work mode, layout, device — the IconOptionSwitcher pattern). Use Tabs when the choice swaps page panels; ChipGroup for multi-select filters. */
export interface OptionSwitcherProps {
  options: Array<string | SwitcherOption>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'track' */
  variant?: 'track' | 'chips' | 'tiles';
  size?: 'sm' | 'md';
  /** Icons only; label becomes aria-label + title. Every option needs an icon and a string label. */
  iconOnly?: boolean;
  /** Accessible group name */
  label?: string;
  className?: string;
}
export declare function OptionSwitcher(props: OptionSwitcherProps): JSX.Element;
