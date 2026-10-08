export interface RangeValue {
  min?: number | null;
  max?: number | null;
}

export type RangeBoundKey = keyof RangeValue;

export const isBoundSet = (bound: number | null | undefined): bound is number =>
  typeof bound === 'number' && Number.isFinite(bound);

export const isInverted = (range: RangeValue): boolean =>
  isBoundSet(range.min) && isBoundSet(range.max) && range.min > range.max;

/** Parses typed text (spaces and a decimal comma allowed). Empty text opens the bound; unparsable text keeps the previous value. */
export const parseBound = (
  text: string,
  previous: number | null | undefined,
  min?: number,
  max?: number,
): number | null => {
  const raw = text.replace(/[\s\u00a0]/gu, '').replace(',', '.');
  if (raw === '') return null;
  const parsed = Number.parseFloat(raw);
  const base = Number.isNaN(parsed) ? previous : parsed;
  return isBoundSet(base) ? Math.min(max ?? Infinity, Math.max(min ?? -Infinity, base)) : null;
};
