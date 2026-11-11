export const DEFAULT_PRICE_DIGITS = 2;

export const priceDigits = (digits: number): number => {
  if (!Number.isInteger(digits) || digits < 0 || digits > 20)
    throw new RangeError('Price digits must be an integer from 0 to 20.');
  return digits;
};
