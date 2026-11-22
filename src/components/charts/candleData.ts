import { parseDecimal } from '../../utils/decimalValue';
import type { StatusTone } from '../../utils/tone';
import { seriesColor } from './chartScale';

export type CandleValue = number | null | undefined;

export interface CandleDatum {
  label: string;
  open: CandleValue;
  high: CandleValue;
  low: CandleValue;
  close: CandleValue;
}

export interface CandleOverlay {
  id: string;
  label: string;
  /** One value per candle; null or undefined leaves a gap. */
  values: readonly CandleValue[];
  /** Defaults to --dv-N in order. */
  color?: string;
}

export interface CandleMarker {
  id: string;
  /** Index of the candle the marker belongs to. */
  index: number;
  price: number;
  label: string;
  /** @default 'neutral' */
  tone?: StatusTone;
}

export interface CandleReference {
  id: string;
  label: string;
  price: number;
  /** @default 'neutral' */
  tone?: StatusTone;
}

export interface MeasuredCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export const candleNumber = (value: CandleValue): number | undefined => parseDecimal(value);

/** A candle with any missing field is a gap. */
export const measuredCandle = (datum: CandleDatum): MeasuredCandle | undefined => {
  const open = candleNumber(datum.open);
  const high = candleNumber(datum.high);
  const low = candleNumber(datum.low);
  const close = candleNumber(datum.close);
  return open === undefined || high === undefined || low === undefined || close === undefined
    ? undefined
    : { open, high, low, close };
};

export const isRising = (candle: MeasuredCandle): boolean => candle.close >= candle.open;

export const overlayColor = (overlay: CandleOverlay, index: number): string => overlay.color ?? seriesColor(index);
