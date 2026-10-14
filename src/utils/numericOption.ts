export const nonNegativeNumber = (value: number, fallback: number): number =>
  Number.isFinite(value) && value >= 0 ? Math.min(value, Number.MAX_SAFE_INTEGER) : fallback;

export const positiveNumber = (value: number, fallback: number): number =>
  Number.isFinite(value) && value > 0 ? value : fallback;

export const positiveInteger = (value: number, fallback: number): number =>
  Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(positiveNumber(value, fallback))));
