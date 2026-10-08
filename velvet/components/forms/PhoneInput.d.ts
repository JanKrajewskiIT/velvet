import * as React from 'react';
export interface PhoneCountry { code: string; name: string; dial: string; /** '#' = digit, e.g. '### ### ###' */ mask: string; }
export declare const PHONE_COUNTRIES: PhoneCountry[];
/** Phone field with country picker (ISO code + dial code) and as-you-type formatting per country mask. Emits E.164 ("+48600100200"). */
export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  countries?: PhoneCountry[];
  defaultCountry?: string;
  /** Controlled ISO country code */
  country?: string;
  onCountryChange?: (code: string) => void;
  /** National digits (controlled) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (e164: string, meta: { country: string; national: string; valid: boolean }) => void;
  /** Show a length error after blur. Default true. */
  validateOnBlur?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Submits E.164 in a hidden input */
  name?: string;
}
export declare function PhoneInput(props: PhoneInputProps): JSX.Element;
