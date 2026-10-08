/** A number is a step of the `--space-*` scale; a string is any CSS length. */
export const spaceValue = (gap: number | string): string => (typeof gap === 'number' ? `var(--space-${gap})` : gap);

/** A number is px; a string is any CSS length. */
export const lengthValue = (length: number | string | undefined): string | undefined =>
  typeof length === 'number' ? `${length}px` : length;
