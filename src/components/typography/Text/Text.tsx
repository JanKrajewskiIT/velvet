import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { toneClass, type TypographyTone } from '../Typography/Typography';
import styles from './Text.module.css';

type TextVariant = 'bodyLg' | 'bodyMd' | 'bodySm' | 'labelLg' | 'labelMd' | 'caption' | 'overline';

interface TextProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
  tone?: TypographyTone;
  class?: string;
  children?: JSX.Element;
}

const Text = (props: Props<TextProps>) => {
  const [local, rest] = splitProps(props, ['as', 'variant', 'tone', 'class', 'children']);

  const variantClass = () => {
    if (local.variant === 'bodyLg') return styles.bodyLg;
    if (local.variant === 'bodySm') return styles.bodySm;
    if (local.variant === 'labelLg') return styles.labelLg;
    if (local.variant === 'labelMd') return styles.labelMd;
    if (local.variant === 'caption') return styles.caption;
    if (local.variant === 'overline') return styles.overline;
    return styles.bodyMd;
  };

  return (
    <Dynamic
      component={local.as ?? 'p'}
      {...rest}
      class={classNames(styles.text, variantClass(), toneClass(styles, local.tone), local.class)}
    >
      {local.children}
    </Dynamic>
  );
};

export type { TextVariant };
export default Text;
