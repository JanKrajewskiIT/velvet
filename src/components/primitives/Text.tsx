import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

const VARIANT_TAG = {
  'display-lg': 'h1',
  'display-md': 'h1',
  'display-sm': 'h2',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  title: 'h3',
  kpi: 'span',
  overline: 'span',
  section: 'span',
  caption: 'span',
  label: 'span',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
} as const satisfies Record<string, ElementTag>;

export type TextVariant = keyof typeof VARIANT_TAG;

const VARIANT_CLASS: Partial<Record<TextVariant, string>> = { label: 'vui-label-text', section: 'vui-section-label' };

export interface TextProps extends HtmlProps<HTMLElement> {
  /** Element override. Defaults by variant: headings → h1–h5, title → h3, body → p, label/caption/overline/kpi → span. */
  as?: ElementTag;
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

/** Applies one type role (`--type-*`) and an optional text colour. */
export const Text = (props: TextProps) => {
  const merged = mergeProps({ variant: 'body' } satisfies TextProps, props);
  const [local, rest] = splitProps(merged, ['as', 'variant', 'tone', 'truncate', 'tabular', 'mono', 'class']);
  return (
    <Polymorphic
      tag={local.as ?? VARIANT_TAG[local.variant]}
      class={cx(
        'vui-text',
        VARIANT_CLASS[local.variant] ?? `vui-${local.variant}`,
        local.tone && `vui-text--${local.tone}`,
        local.truncate && 'vui-text--truncate',
        local.tabular && 'vui-text--tabular',
        local.mono && 'vui-text--mono',
        local.class,
      )}
      {...rest}
    />
  );
};
