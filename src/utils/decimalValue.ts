const DECIMAL = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?$/u;

export const parseDecimal = (value: unknown): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string' || !DECIMAL.test(value.trim())) return undefined;
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const decimalPlaces = (value: number): number => {
  const [mantissa = '', exponent = '0'] = String(value).toLowerCase().split('e');
  return Math.max(0, (mantissa.split('.')[1]?.length ?? 0) - Number(exponent));
};

export interface NumberRange {
  min: number;
  max: number;
  step: number;
}

export const numberRange = (min = -Infinity, max = Infinity, step = 1): NumberRange => {
  if (Number.isNaN(min) || Number.isNaN(max) || min === Infinity || max === -Infinity || min > max)
    throw new RangeError('Numeric bounds must be ordered numbers.');
  if (!Number.isFinite(step) || step <= 0) throw new RangeError('Numeric step must be positive and finite.');
  return { min, max, step };
};
