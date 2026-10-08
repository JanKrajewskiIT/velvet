import * as React from 'react';
export interface CommandItem { id?: string; label: string; icon?: string; description?: string; shortcut?: string; /** Extra search terms */ keywords?: string[]; onSelect?: () => void }
export interface CommandGroup { label: string; items: CommandItem[] }
/** ⌘K palette: fuzzy-filtered, grouped results with match highlight; ↑↓ Enter Esc. Pair with SearchTrigger (it owns the ⌘K hotkey). */
export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}
export declare function CommandPalette(props: CommandPaletteProps): JSX.Element | null;
