import type { HeadingVariant, TextVariant, TypographyTone } from './Typography';
import styles from './Typography.module.css';

export const textVariantClassByValue: Record<TextVariant, string | undefined> = {
  bodyLg: styles.typeBodyLg,
  bodyMd: styles.typeBodyMd,
  bodySm: styles.typeBodySm,
  labelLg: styles.typeLabelLg,
  labelMd: styles.typeLabelMd,
  caption: styles.typeCaption,
  overline: styles.typeOverline,
};

export const headingVariantClassByValue: Record<HeadingVariant, string | undefined> = {
  displayLg: styles.typeDisplayLg,
  displayMd: styles.typeDisplayMd,
  h1: styles.typeH1,
  h2: styles.typeH2,
  h3: styles.typeH3,
  titleLg: styles.typeTitleLg,
  titleMd: styles.typeTitleMd,
};

export const typographyToneClassByValue: Record<TypographyTone, string | undefined> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  secondary: styles.toneSecondary,
  tertiary: styles.toneTertiary,
  inverse: styles.toneInverse,
  primary: styles.tonePrimary,
  inherit: styles.toneInherit,
};
