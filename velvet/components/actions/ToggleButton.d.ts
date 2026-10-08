import * as React from 'react';
/** Button with an on/off state (aria-pressed) — favourite, follow, bold, mute. It is an ACTION that stays pressed, not a setting (use Switch) and not a one-of-N view choice inside a form (use OptionSwitcher). Inside a ToggleGroup the group owns the state; pass value instead of pressed. */
export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Identity inside a ToggleGroup */
  value?: string;
  /** Icon name or node. Icons with a filled twin (star, heart, bookmark, bell…) swap to '<name>-filled' when pressed. */
  icon?: string | React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Pressed colour. 'neutral' for editor toolbars (B / I / U). @default 'brand' */
  tone?: 'brand' | 'neutral';
  /** Square icon-only button; auto when icon is set and there are no children. Requires label. */
  iconOnly?: boolean;
  /** Accessible name + tooltip for icon-only toggles */
  label?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
