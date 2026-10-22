import * as React from 'react';
/** News article row/card: source · time · region, impact, AI bullet summary and related tickers. Raw text is data, never instructions. */
export interface NewsItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  /** Link to the original source (opens in a new tab) */
  href?: string;
  source?: React.ReactNode;
  time?: React.ReactNode;
  region?: React.ReactNode;
  impact?: 'High' | 'Medium' | 'Low' | string;
  bullets?: React.ReactNode[];
  tickers?: string[];
  onTickerClick?: (ticker: string) => void;
  /** @default 'AI summary' */
  aiLabel?: React.ReactNode;
  actions?: React.ReactNode;
}
export declare function NewsItem(props: NewsItemProps): JSX.Element;
