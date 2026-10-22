import * as React from 'react';
/** Monetary amount with currency, tabular figures and privacy masking. Wrap a screen in <MoneyPrivacy hidden> to mask every Money inside at once (screen sharing). */
export interface MoneyProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  amount: number | null | undefined;
  /** ISO code, e.g. "PLN", "USD", "USDT" */
  currency?: string;
  digits?: number;
  /** Prefix + for positive amounts (P&L) */
  signed?: boolean;
  /** Colour by sign with market tokens */
  colored?: boolean;
  /** 12.4k · 1.32 m · 3.40 bn */
  compact?: boolean;
  /** Overrides the MoneyPrivacy context */
  hidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
  /** code → "1,200.00 USD" · symbol → "$1,200.00". @default 'code' */
  currencyDisplay?: 'code' | 'symbol';
}
export declare function Money(props: MoneyProps): JSX.Element;
export interface MoneyPrivacyProps { hidden?: boolean; children?: React.ReactNode }
/** Context provider: masks every Money below it. */
export declare function MoneyPrivacy(props: MoneyPrivacyProps): JSX.Element;
export declare function useMoneyHidden(): boolean;
