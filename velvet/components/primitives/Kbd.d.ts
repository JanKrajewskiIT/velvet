import * as React from 'react';
/** Keyboard key(s). keys="mod+k" renders ⌘ K on Mac, Ctrl K elsewhere. Aliases: mod cmd ctrl alt shift enter esc up down left right tab backspace space. */
export interface KbdProps { keys?: string | string[]; children?: React.ReactNode; size?: 'sm' | 'md';
  /** No key cap — bare shortcut text for menus, command palette, tooltips (inherits colour). @default false */
  plain?: boolean;
  className?: string }
export declare function Kbd(props: KbdProps): JSX.Element;
