import * as React from 'react';
/**
 * Atom. Uppercase group heading inside menus, listboxes, sidebars, filter bars and panels ("RECENT", "CONNECTED").
 * Reads --type-section. For page-level eyebrows use Text variant="overline".
 */
export interface SectionLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'div' */
  as?: keyof JSX.IntrinsicElements;
  /** Leading glyph name or node */
  icon?: string | React.ReactNode;
  /** Trailing slot — count, "Clear" link, action */
  end?: React.ReactNode;
  /** @default tertiary */
  tone?: 'secondary' | 'brand';
  /** Sticks to the top of a scrolling list with a frosted ground */
  sticky?: boolean;
  children?: React.ReactNode;
}
export declare function SectionLabel(props: SectionLabelProps): JSX.Element;
