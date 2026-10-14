import { numericScale } from './numericScale';

const DEFAULT_TICK_COUNT = 4;
const SERIES_COLOR_COUNT = 8;

/** Round axis ticks from 0 up to the first "nice" step at or above `max`. */
export const niceTicks = (max: number, count = DEFAULT_TICK_COUNT): number[] => {
  if (!Number.isFinite(max) || !Number.isInteger(count) || count < 1 || count > 100)
    throw new RangeError('Axis maximum must be finite and tick count must be an integer from 1 to 100.');
  if (max <= 0) return [0];
  return numericScale([max], count).ticks;
};

const COMPACT_FROM = 1e3;

interface CompactFormats {
  locale: string;
  plain: Intl.NumberFormat;
  abbreviated: Intl.NumberFormat;
}

let compactFormats: CompactFormats | undefined;

const compactFormatsFor = (locale: string): CompactFormats => {
  if (compactFormats?.locale !== locale) {
    compactFormats = {
      locale,
      plain: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
      abbreviated: new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    };
  }
  return compactFormats;
};

/** 1200 → "1.2K", 3 400 000 → "3.4M" in English; "1,2 tys.", "3,4 mln" in Polish. */
export const compact = (n: number, locale = 'en'): string => {
  const formats = compactFormatsFor(locale);
  return Math.abs(n) >= COMPACT_FROM ? formats.abbreviated.format(n) : formats.plain.format(n);
};

/** Data-viz palette colour for the series at `index`, cycling through `--dv-1…8`. */
export const seriesColor = (index: number): string => `var(--dv-${(index % SERIES_COLOR_COUNT) + 1})`;

/** Whole-number share of `total`, 0 when the total is empty. */
export const percentOf = (value: number, total: number): number => Math.round((value / (total || 1)) * 100);
