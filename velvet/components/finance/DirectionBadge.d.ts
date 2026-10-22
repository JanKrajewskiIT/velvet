import * as React from 'react';
/** Trade direction / side label with market colours: LONG·BUY·ADD up, SHORT·SELL·TRIM down, WAIT·HOLD flat, NO_TRADE·SKIP muted. */
export interface DirectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction: 'LONG' | 'SHORT' | 'WAIT' | 'NO_TRADE' | 'BUY' | 'SELL' | 'ADD' | 'TRIM' | 'HOLD' | 'SKIP' | string;
  /** Extra text after a divider, e.g. order type "LMT" */
  suffix?: React.ReactNode;
  icon?: boolean;
  /** @default 'solid' */
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
}
export declare function DirectionBadge(props: DirectionBadgeProps): JSX.Element;
