import * as React from 'react';
/** Atom. A highlighted run inside text: search hits, emphasis, @mentions. */
export interface MarkProps extends React.HTMLAttributes<HTMLElement> {
  /** highlight: tinted fill · text: brand colour, no fill · mention: chip-like. @default 'highlight' */
  variant?: 'highlight' | 'text' | 'mention';
}
export declare function Mark(props: MarkProps): JSX.Element;
/** Wraps the first case-insensitive match of query in a Mark */
export declare function highlightMatch(text: string, query?: string, variant?: MarkProps['variant']): React.ReactNode;
