import * as React from 'react';
/**
 * Atom. Applies one type role (--type-*) and an optional text colour. Use instead of hand-combining font tokens.
 */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element override. Defaults by variant: headings → h1–h5, title → h3, body → p, label/caption/overline/kpi → span */
  as?: keyof JSX.IntrinsicElements;
  /** @default 'body' */
  variant?: 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'kpi' | 'body-lg' | 'body' | 'body-sm' | 'label' | 'caption' | 'overline' | 'section';
  /** Text colour. Omit to inherit the role default. */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'danger' | 'success' | 'warning' | 'inherit';
  /** Single line with ellipsis */
  truncate?: boolean;
  /** Tabular figures for numbers that update or align */
  tabular?: boolean;
  /** JetBrains Mono */
  mono?: boolean;
  children?: React.ReactNode;
}
export declare function Text(props: TextProps): JSX.Element;
