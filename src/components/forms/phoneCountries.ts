export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  name: string;
  /** International dial code without the plus sign. */
  dial: string;
  /** National number layout; `#` is a digit, e.g. `'### ### ###'`. */
  mask: string;
}

/** A country list always has a fallback entry. */
export type PhoneCountryList = readonly [PhoneCountry, ...PhoneCountry[]];

export const PHONE_COUNTRIES: PhoneCountryList = [
  { code: 'PL', name: 'Poland', dial: '48', mask: '### ### ###' },
  { code: 'DE', name: 'Germany', dial: '49', mask: '#### #######' },
  { code: 'GB', name: 'United Kingdom', dial: '44', mask: '#### ######' },
  { code: 'US', name: 'United States', dial: '1', mask: '(###) ###-####' },
  { code: 'FR', name: 'France', dial: '33', mask: '# ## ## ## ##' },
  { code: 'ES', name: 'Spain', dial: '34', mask: '### ### ###' },
  { code: 'IT', name: 'Italy', dial: '39', mask: '### ### ####' },
  { code: 'NL', name: 'Netherlands', dial: '31', mask: '# ########' },
  { code: 'CZ', name: 'Czechia', dial: '420', mask: '### ### ###' },
  { code: 'UA', name: 'Ukraine', dial: '380', mask: '## ### ## ##' },
  { code: 'SE', name: 'Sweden', dial: '46', mask: '## ### ## ##' },
];

const DIGIT_SLOT = '#';

/** Number of digits a national number of this country has. */
export const nationalLength = (country: PhoneCountry): number =>
  Array.from(country.mask).filter((char) => char === DIGIT_SLOT).length;

/** Lays digits over the mask; digits beyond the mask are appended unformatted. */
export const formatNational = (digits: string, mask: string): string => {
  let formatted = '';
  let used = 0;
  for (const char of mask) {
    if (used >= digits.length) break;
    formatted += char === DIGIT_SLOT ? digits.charAt(used++) : char;
  }
  return formatted + digits.slice(used);
};

export const onlyDigits = (text: string): string => text.replace(/\D/gu, '');
