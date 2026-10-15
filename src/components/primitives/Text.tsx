import { type JSX, mergeProps, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './Text.module.css';
import { TEXT_ROLES, textRoleClass, type TextVariant, typographyClass } from './typography';

const TEXT_TONE_CLASSES = {
  primary: styles.textVariantPrimary,
  secondary: styles.textVariantSecondary,
  tertiary: styles.textVariantTertiary,
  brand: styles.textVariantBrand,
  danger: styles.textVariantDanger,
  success: styles.textVariantSuccess,
  warning: styles.textVariantWarning,
  inherit: styles.textVariantInherit,
} as const;

export type { TextVariant } from './typography';

export interface TextOptions {
  /** @default 'body' */
  variant?: TextVariant;
  /** Text colour. Omit to inherit the role default. */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'danger' | 'success' | 'warning' | 'inherit';
  /** Single line with ellipsis. */
  truncate?: boolean;
  /** Tabular figures for numbers that update or align. */
  tabular?: boolean;
  /** JetBrains Mono. */
  mono?: boolean;
}

export interface TextProps
  extends
    HtmlProps<HTMLElement>,
    TextOptions,
    Pick<JSX.LabelHTMLAttributes<HTMLLabelElement>, 'for'>,
    Pick<JSX.TimeHTMLAttributes<HTMLTimeElement>, 'dateTime' | 'datetime'> {
  /** Element override, independent of the visual variant. */
  as?: ElementTag;
}

/** Applies one type role (`--type-*`) and an optional text colour. */
export const Text = (props: TextProps) => {
  const merged = mergeProps({ variant: 'body' } satisfies TextOptions, props);
  const [local, rest] = splitProps(merged, ['as', 'variant', 'tone', 'truncate', 'tabular', 'mono', 'class']);
  return (
    <Polymorphic
      {...rest}
      tag={local.as ?? TEXT_ROLES[local.variant]}
      data-vui-text-tone={local.tone}
      class={cx(
        styles.text,
        typographyClass(local.variant),
        textRoleClass(local.variant),
        local.tone && variantClass(TEXT_TONE_CLASSES, local.tone),
        local.truncate && styles.textVariantTruncate,
        local.tabular && styles.textVariantTabular,
        local.mono && styles.textVariantMono,
        local.class,
      )}
    />
  );
};
