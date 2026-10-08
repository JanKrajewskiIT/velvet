import * as React from 'react';
/**
 * Atom. One-line "nothing here" inside a list, panel or column: "No matches", "Drop cards here", "No events this day."
 * For a whole empty view with title, illustration and actions use EmptyState (14 Feedback).
 */
export interface EmptyTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Glyph name or node above the text */
  icon?: string | React.ReactNode;
  /** start = left-aligned, no inline padding (inside prose / timelines). @default 'center' */
  align?: 'center' | 'start';
  /** Dashed outline — for drop zones and empty editable lists */
  dashed?: boolean;
  /** Element to render — li inside lists, p inside prose. @default 'div' */
  as?: 'div' | 'li' | 'p' | 'span';
}
export declare function EmptyText(props: EmptyTextProps): JSX.Element;
