export type TypographyTone = 'default' | 'muted' | 'secondary' | 'tertiary' | 'inverse' | 'primary' | 'inherit';
export type TextVariant = 'bodyLg' | 'bodyMd' | 'bodySm' | 'labelLg' | 'labelMd' | 'caption' | 'overline';
export type HeadingVariant = 'displayLg' | 'displayMd' | 'h1' | 'h2' | 'h3' | 'titleLg' | 'titleMd';

const textVariantToClassKey: Record<TextVariant, string> = {
  bodyLg: 'typeBodyLg',
  bodyMd: 'typeBodyMd',
  bodySm: 'typeBodySm',
  labelLg: 'typeLabelLg',
  labelMd: 'typeLabelMd',
  caption: 'typeCaption',
  overline: 'typeOverline',
};

const headingVariantToClassKey: Record<HeadingVariant, string> = {
  displayLg: 'typeDisplayLg',
  displayMd: 'typeDisplayMd',
  h1: 'typeH1',
  h2: 'typeH2',
  h3: 'typeH3',
  titleLg: 'typeTitleLg',
  titleMd: 'typeTitleMd',
};

const toneToClassKey: Record<TypographyTone, string> = {
  default: 'toneDefault',
  muted: 'toneMuted',
  secondary: 'toneSecondary',
  tertiary: 'toneTertiary',
  inverse: 'toneInverse',
  primary: 'tonePrimary',
  inherit: 'toneInherit',
};

export const textVariantClass = (styles: Record<string, string>, variant?: TextVariant) => {
  return styles[textVariantToClassKey[variant ?? 'bodyMd']];
};

export const headingVariantClass = (styles: Record<string, string>, variant?: HeadingVariant) => {
  return styles[headingVariantToClassKey[variant ?? 'h2']];
};

export const toneClass = (styles: Record<string, string>, tone?: TypographyTone) => {
  return styles[toneToClassKey[tone ?? 'default']];
};
