import type { StatusTone } from '../../utils/tone';
import {
  type CandleDatum,
  type CandleMarker,
  candleNumber,
  type CandleOverlay,
  isRising,
  measuredCandle,
  overlayColor,
} from './candleData';
import type { ChartTooltipRow } from './ChartTooltip';

export interface CandleLabels {
  open: string;
  high: string;
  low: string;
  close: string;
  missing: string;
}

export const PRICE_FIELDS = ['open', 'high', 'low', 'close'] as const;

export const markerColor = (tone: StatusTone = 'neutral'): string => `var(--status-${tone}-solid)`;
export const candleColor = (rising: boolean): string => (rising ? 'var(--trend-up-solid)' : 'var(--trend-down-solid)');

export const markersAt = (markers: readonly CandleMarker[], index: number): CandleMarker[] =>
  markers.filter((marker) => marker.index === index);

export const overlayText = (
  overlay: CandleOverlay,
  index: number,
  format: (value: number) => string,
  missing: string,
): string => {
  const value = candleNumber(overlay.values[index]);
  return value === undefined ? missing : format(value);
};

export const priceText = (
  datum: CandleDatum,
  field: (typeof PRICE_FIELDS)[number],
  format: (value: number) => string,
  missing: string,
): string => {
  const value = candleNumber(datum[field]);
  return value === undefined ? missing : format(value);
};

export type CandleRow = ChartTooltipRow & { label: string; value: string };

export const candleRows = (
  datum: CandleDatum,
  index: number,
  overlays: readonly CandleOverlay[],
  markers: readonly CandleMarker[],
  format: (value: number) => string,
  labels: CandleLabels,
): CandleRow[] => {
  const measured = measuredCandle(datum);
  return [
    ...PRICE_FIELDS.map((field) => ({
      key: field,
      label: labels[field],
      color: field === 'close' && measured ? candleColor(isRising(measured)) : undefined,
      value: priceText(datum, field, format, labels.missing),
    })),
    ...overlays.map((overlay, position) => ({
      key: `overlay:${overlay.id}`,
      label: overlay.label,
      color: overlayColor(overlay, position),
      value: overlayText(overlay, index, format, labels.missing),
    })),
    ...markersAt(markers, index).map((marker) => ({
      key: `marker:${marker.id}`,
      label: marker.label,
      color: markerColor(marker.tone),
      value: format(marker.price),
    })),
  ];
};
