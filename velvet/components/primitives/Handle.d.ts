import * as React from 'react';
/**
 * Atom. Drag grip for reorderable rows and cards (EditableCollection, TransferList). A focusable button by default —
 * wire draggable/onDragStart and ArrowUp/ArrowDown in onKeyDown so reordering works without a mouse.
 */
export interface HandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name incl. the keyboard hint, e.g. "Reorder item 2 (↑↓)". @default 'Drag to reorder' */
  label?: string;
  /** Visual-only grip (the whole row is the drag target). Renders a hidden span. */
  decorative?: boolean;
  /** Swap the grip glyph — e.g. 'lock' for a row that can't move. @default 'grip-vertical' */
  icon?: string;
}
export declare function Handle(props: HandleProps): JSX.Element;
