import type { QuoteStore } from './quoteStore';

export interface OrderTicketOrder {
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  qty: number;
  limitPrice: number | null;
  stopPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  tif: 'day' | 'gtc';
  notional: number | null;
  risk: number | null;
}

export interface OrderTicketLabels {
  title: string;
  side: string;
  buy: string;
  sell: string;
  type: string;
  market: string;
  limit: string;
  stop: string;
  qty: string;
  limitPrice: string;
  stopPrice: string;
  sl: string;
  tp: string;
  tif: string;
  day: string;
  gtc: string;
  notional: string;
  risk: string;
  ofEquity: string;
  rr: string;
  power: string;
  estimate: string;
  noStop: string;
  wrongSl: string;
  wrongTp: string;
  overLimit: string;
  overPower: string;
  reduceOnly: string;
  review: string;
  confirmTitle: string;
  send: string;
  cancel: string;
}

export interface OrderTicketProps {
  symbol?: string;
  price?: number | null;
  quotes?: QuoteStore;
  digits?: number;
  locale?: string;
  currency?: string;
  qtyStep?: number;
  minQty?: number;
  qtyUnit?: string;
  defaultQty?: number;
  equity?: number;
  buyingPower?: number;
  maxRiskPct?: number;
  account?: string;
  envLabel?: string;
  envTone?: 'neutral' | 'info' | 'warning' | 'danger';
  confirmTone?: 'primary' | 'danger';
  blocked?: string | null;
  reduceOnly?: boolean;
  position?: number;
  hidden?: boolean;
  onSubmit?: (order: OrderTicketOrder) => void;
  labels?: Partial<OrderTicketLabels>;
  class?: string;
}
