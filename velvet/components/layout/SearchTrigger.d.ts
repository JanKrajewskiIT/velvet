import * as React from 'react';
/** Search field look-alike that opens a command palette. Listens for ⌘K / Ctrl+K globally. Collapses to an icon under 640px. */
export interface SearchTriggerProps {
  /** @default 'Search…' */
  placeholder?: string;
  /** @default '⌘K' */
  shortcut?: string;
  /** Register the global ⌘K / Ctrl+K listener. @default true */
  hotkey?: boolean;
  onOpen?: () => void;
  className?: string;
}
export declare function SearchTrigger(props: SearchTriggerProps): JSX.Element;
