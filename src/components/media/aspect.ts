export const ASPECTS = Object.freeze(['square', 'video', 'photo', 'portrait', 'wide'] as const);

export type Aspect = (typeof ASPECTS)[number];

/** An `--aspect-*` token name, or any CSS ratio such as `"4/5"`. */
export type AspectRatio = Aspect | (string & Record<never, never>);

const ASPECT_LABELS: Record<Aspect, string> = {
  square: '1 : 1',
  video: '16 : 9',
  photo: '4 : 3',
  portrait: '3 : 4',
  wide: '21 : 9',
};

const isAspect = (value: string): value is Aspect => (ASPECTS as readonly string[]).includes(value);

/** Printable "16 : 9" form of a token name or a literal ratio. */
export const aspectLabel = (ratio: string): string =>
  isAspect(ratio) ? ASPECT_LABELS[ratio] : ratio.replace('/', ' : ');

/** CSS `aspect-ratio` value for a token name or a literal ratio. */
export const aspectRatioValue = (ratio: string): string => (isAspect(ratio) ? `var(--aspect-${ratio})` : ratio);
