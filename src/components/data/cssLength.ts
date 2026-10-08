/** A number is pixels; a string is already a CSS length. Solid does not append `px` to numeric style values. */
export const cssLength = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value;
