/** Numbers are pixel lengths; strings retain the consumer's CSS unit. */
export const cssLength = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value;
