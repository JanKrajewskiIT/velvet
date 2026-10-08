export const PASSWORD_MAX_SCORE = 4;

const MIN_LENGTH = 8;
const LONG_LENGTH = 12;
const TOO_SHORT_LENGTH = 6;

/** 0–4 score (−1 for empty): length ≥ 8, mixed case, digit, symbol, length ≥ 12. */
export const passwordScore = (value: string): number => {
  if (!value) return -1;
  const checks = [
    value.length >= MIN_LENGTH,
    /[a-z]/u.test(value) && /[A-Z]/u.test(value),
    /\d/u.test(value),
    /[^A-Za-z0-9]/u.test(value),
    value.length >= LONG_LENGTH,
  ];
  const score = checks.filter(Boolean).length;
  return Math.min(PASSWORD_MAX_SCORE, value.length < TOO_SHORT_LENGTH ? Math.min(score, 1) : score);
};
