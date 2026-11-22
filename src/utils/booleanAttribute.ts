/** Serializes enumerated HTML/ARIA booleans, for which false is a value. */
export const booleanAttribute = <T extends string | boolean | undefined>(
  value: T,
): Exclude<T, boolean> | 'true' | 'false' =>
  (typeof value === 'boolean' ? (value ? 'true' : 'false') : value) as Exclude<T, boolean> | 'true' | 'false';

/** Reads a native boolean attribute whose empty string also means present. */
export const isBooleanAttributeSet = (value: boolean | '' | undefined): boolean => value === true || value === '';
