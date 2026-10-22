import * as React from 'react';
/** Two-line table cell: primary value over a muted secondary line. Use for ID + timestamp, name + meta, price + fill. */
export interface CellStackProps extends React.HTMLAttributes<HTMLSpanElement> {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  /** Primary in JetBrains Mono with tabular figures (IDs, symbols, numbers) */
  mono?: boolean;
  secondaryMono?: boolean;
  /** @default true */
  strong?: boolean;
  /** Right-align (numeric columns) */
  align?: 'left' | 'right';
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}
export declare function CellStack(props: CellStackProps): JSX.Element;
