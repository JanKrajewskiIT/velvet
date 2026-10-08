const TICK_MULTIPLIERS = [1, 2, 2.5, 5, 10];
const DEFAULT_TICK_COUNT = 4;
const SERIES_COLOR_COUNT = 8;

/** Round axis ticks from 0 up to the first "nice" step at or above `max`. */
export const niceTicks = (max: number, count = DEFAULT_TICK_COUNT): number[] => {
  if (max <= 0) return [0];
  const raw = max / count;
  const unit = 10 ** Math.floor(Math.log10(raw));
  const step = TICK_MULTIPLIERS.map((m) => m * unit).find((s) => s >= raw) ?? unit * 10;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(10));
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
