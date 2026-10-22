import * as React from 'react';
/** Signed price / return change with direction colour (market tokens, not status tokens), arrow and tabular figures. null renders an em dash — never 0. */
export interface PriceChangeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number | null | undefined;
  /** percent → %, bp → " bp", pp → " pp", number → no suffix. @default 'percent' */
  format?: 'percent' | 'number' | 'bp' | 'pp';
  digits?: number;
  /** Custom suffix, overrides format */
  unit?: string;
  /** @default true */
  arrow?: boolean;
  /** text = coloured text · pill = tinted background · solid = filled chip. @default 'text' */
  variant?: 'text' | 'pill' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  /** |value| ≤ threshold renders as flat. @default 0 */
  flatThreshold?: number;
  /** Screen-reader prefix, e.g. "Day change" */
  label?: string;
}
export declare function PriceChange(props: PriceChangeProps): JSX.Element;
