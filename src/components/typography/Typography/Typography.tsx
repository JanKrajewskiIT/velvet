export type TypographyTone = 'default' | 'muted' | 'secondary' | 'tertiary' | 'inverse' | 'primary';

export const toneClass = (styles: Record<string, string>, tone?: TypographyTone) => {
  const toneToClassKey: Record<TypographyTone, keyof typeof styles> = {
    default: 'toneDefault',
    muted: 'toneMuted',
    secondary: 'toneSecondary',
    tertiary: 'toneTertiary',
    inverse: 'toneInverse',
    primary: 'tonePrimary',
  };

  return styles[toneToClassKey[tone ?? 'default']];
};
