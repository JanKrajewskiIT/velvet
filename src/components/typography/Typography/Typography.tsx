export type TypographyTone = 'default' | 'muted' | 'secondary' | 'tertiary' | 'inverse' | 'primary';

export const toneClass = (styles: Record<string, string>, tone?: TypographyTone) => {
  if (tone === 'muted') return styles.toneMuted;
  if (tone === 'secondary') return styles.toneSecondary;
  if (tone === 'tertiary') return styles.toneTertiary;
  if (tone === 'inverse') return styles.toneInverse;
  if (tone === 'primary') return styles.tonePrimary;
  return styles.toneDefault;
};
