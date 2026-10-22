import * as React from 'react';
/** Ticker + exchange chip + name. Clickable when onClick is set (opens the instrument). */
export interface InstrumentLabelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  symbol: string;
  name?: React.ReactNode;
  /** Venue / market code, e.g. "GPW", "NASDAQ", "OANDA" */
  exchange?: string;
  /** Logo node, or text for the initials tile. Defaults to the symbol. */
  mark?: React.ReactNode;
  showMark?: boolean;
  /** Extra text after the name, e.g. account or source */
  meta?: React.ReactNode;
  size?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export declare function InstrumentLabel(props: InstrumentLabelProps): JSX.Element;
