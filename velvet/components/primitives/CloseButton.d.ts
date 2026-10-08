import * as React from 'react';
/**
 * Atom. The one "×" control: closes, dismisses, removes, clears. Always a real control with an accessible name.
 * button = ghost icon button (Dialog, Toast, Alert) · field = clear inside a Control (SearchInput, pickers) · tag = remove inside a Tag/chip · bare = no skin, host class only.
 */
export interface CloseButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** @default 'button' */
  variant?: 'button' | 'field' | 'tag' | 'bare';
  /** Only for variant="button". @default 'sm' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible name — say what goes away: "Remove Design", "Clear search". @default 'Close' */
  label?: string;
  /** Glyph name. @default 'x' */
  icon?: string;
  /** span = for use inside another button (selectable Tag); keeps keyboard Enter/Space and stops propagation. @default 'button' */
  as?: 'button' | 'span';
  disabled?: boolean;
  onClick?: (e: React.SyntheticEvent) => void;
}
export declare function CloseButton(props: CloseButtonProps): JSX.Element;
