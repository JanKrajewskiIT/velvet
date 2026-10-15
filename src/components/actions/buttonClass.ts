import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type TextVariant, typographyClass } from '../primitives/typography';
import styles from './buttonClass.module.css';

const BUTTON_VARIANT_CLASSES = {
  primary: styles.btnVariantPrimary,
  secondary: styles.btnVariantSecondary,
  soft: styles.btnVariantSoft,
  ghost: styles.btnVariantGhost,
  danger: styles.btnVariantDanger,
  link: styles.btnVariantLink,
  dashed: styles.btnVariantDashed,
  raised: styles.btnVariantRaised,
  overlay: styles.btnVariantOverlay,
} as const;

const BUTTON_SIZE_CLASSES = {
  xs: styles.btnVariantXs,
  sm: styles.btnVariantSm,
  md: undefined,
  lg: styles.btnVariantLg,
} as const;

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const BUTTON_TYPOGRAPHY = {
  xs: 'button-sm',
  sm: 'button-sm',
  md: 'button',
  lg: 'button-lg',
} as const satisfies Record<ButtonSize, TextVariant>;

export interface ButtonClassOptions {
  variant: string;
  size?: ButtonSize;
  icon?: boolean;
  block?: boolean;
  circle?: boolean;
}

/** Shared button skin and variant classes. */
export const buttonClass = ({ variant, size, icon, block, circle }: ButtonClassOptions): string =>
  cx(
    styles.btn,
    typographyClass(BUTTON_TYPOGRAPHY[size ?? 'md']),
    variantClass(BUTTON_VARIANT_CLASSES, variant),
    variantClass(BUTTON_SIZE_CLASSES, size),
    icon && styles.btnVariantIcon,
    block && styles.btnVariantBlock,
    circle && styles.btnVariantCircle,
  );
