import { createMemo } from 'solid-js';

import {
  type CandleDatum,
  type CandleMarker,
  candleNumber,
  type CandleOverlay,
  type CandleReference,
  measuredCandle,
  overlayColor,
} from './candleData';
import { LINE_PAD } from './createLineGeometry';
import { linePath } from './linePath';
import { valueSegments } from './lineSegments';
import { numericScale } from './numericScale';

const MIN_LABEL_SPACING = 64;
const MAX_BODY_WIDTH = 14;
const BODY_RATIO = 0.6;
const TICK_COUNT = 4;

interface CandleGeometryOptions {
  candles: () => readonly CandleDatum[];
  overlays: () => readonly CandleOverlay[];
  markers: () => readonly CandleMarker[];
  references: () => readonly CandleReference[];
  width: () => number;
  height: () => number;
}

export const createCandleGeometry = (options: CandleGeometryOptions) => {
  const innerWidth = () => Math.max(0, options.width() - LINE_PAD.l - LINE_PAD.r);
  const innerHeight = () => Math.max(0, options.height() - LINE_PAD.t - LINE_PAD.b);
  const lastIndex = () => options.candles().length - 1;

  const refs = createMemo(() => options.references().filter((reference) => Number.isFinite(reference.price)));

  const scale = createMemo(() => {
    const prices = options.candles().flatMap((datum) => {
      const candle = measuredCandle(datum);
      return candle ? [candle.high, candle.low] : [];
    });
    const overlayValues = options.overlays().flatMap((overlay) =>
      overlay.values.flatMap((value) => {
        const number = candleNumber(value);
        return number === undefined ? [] : [number];
      }),
    );
    const markerPrices = options.markers().map((marker) => marker.price);
    const referencePrices = refs().map((reference) => reference.price);
    return numericScale([...prices, ...overlayValues, ...markerPrices, ...referencePrices], TICK_COUNT, false);
  });
  const ticks = () => scale().ticks;
  const x = (index: number) =>
    LINE_PAD.l + (options.candles().length < 2 ? innerWidth() / 2 : (index / lastIndex()) * innerWidth());
  const y = (price: number) => LINE_PAD.t + innerHeight() * (1 - scale().position(price));
  const baseline = () => LINE_PAD.t + innerHeight();
  const labelEvery = () =>
    Math.ceil(options.candles().length / Math.max(2, Math.floor(innerWidth() / MIN_LABEL_SPACING)));
  const slot = () => (options.candles().length < 2 ? innerWidth() : innerWidth() / lastIndex());
  const bodyWidth = () => Math.min(MAX_BODY_WIDTH, (innerWidth() / Math.max(options.candles().length, 1)) * BODY_RATIO);

  const bodies = createMemo(() =>
    options.candles().flatMap((datum, index) => {
      const candle = measuredCandle(datum);
      return candle ? [{ index, candle }] : [];
    }),
  );
  const lines = createMemo(() =>
    options.overlays().map((overlay, index) => ({
      id: overlay.id,
      color: overlayColor(overlay, index),
      path: valueSegments(overlay.values.map(candleNumber), (at, value) => [x(at), y(value)])
        .map(linePath)
        .join(''),
    })),
  );
  const pins = createMemo(() =>
    options
      .markers()
      .filter((marker) => Number.isInteger(marker.index) && marker.index >= 0 && marker.index <= lastIndex())
      .filter((marker) => Number.isFinite(marker.price)),
  );

  const gaps = createMemo(() => options.candles().flatMap((datum, index) => (measuredCandle(datum) ? [] : [index])));
  const guides = createMemo(() =>
    pins().flatMap((marker) => {
      const datum = options.candles()[marker.index];
      if (datum === undefined) return [];
      const candle = measuredCandle(datum);
      if (!candle || (marker.price <= candle.high && marker.price >= candle.low)) return [];
      const to = marker.price > candle.high ? candle.high : candle.low;
      return [{ id: marker.id, index: marker.index, from: marker.price, to }];
    }),
  );

  return {
    innerWidth,
    lastIndex,
    ticks,
    x,
    y,
    baseline,
    labelEvery,
    slot,
    bodyWidth,
    bodies,
    lines,
    pins,
    refs,
    gaps,
    guides,
  } as const;
};
