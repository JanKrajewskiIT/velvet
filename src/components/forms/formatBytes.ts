const KIB = 1024;
const MIB = KIB * 1024;
const SINGLE_DECIMAL_BELOW = 10 * KIB;

let cached: { locale: string; whole: Intl.NumberFormat; decimal: Intl.NumberFormat } | undefined;

const formatsFor = (locale: string) => {
  if (cached?.locale !== locale) {
    cached = {
      locale,
      whole: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
      decimal: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    };
  }
  return cached;
};

export const formatBytes = (bytes: number, locale = 'en'): string => {
  const formats = formatsFor(locale);
  if (bytes < KIB) return `${formats.whole.format(bytes)} B`;
  if (bytes < MIB) {
    const format = bytes < SINGLE_DECIMAL_BELOW ? formats.decimal : formats.whole;
    return `${format.format(bytes / KIB)} KB`;
  }
  return `${formats.decimal.format(bytes / MIB)} MB`;
};
