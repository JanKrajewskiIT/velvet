import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Text.module.css';

type TextVariant = 'bodyLg' | 'bodyMd' | 'bodySm' | 'labelLg' | 'labelMd' | 'caption' | 'overline';
type TextTone = 'default' | 'muted' | 'secondary' | 'tertiary' | 'inverse' | 'primary';

interface TextOwnProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
  tone?: TextTone;
}

const Text = (props: Props<TextOwnProps>) => {
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

  const toneClass = () => {
    if (local.tone === 'muted') return styles.toneMuted;
    if (local.tone === 'secondary') return styles.toneSecondary;
    if (local.tone === 'tertiary') return styles.toneTertiary;
    if (local.tone === 'inverse') return styles.toneInverse;
    if (local.tone === 'primary') return styles.tonePrimary;
    return styles.toneDefault;
  };

  return (
    <Dynamic
      component={local.as ?? 'p'}
      {...rest}
      class={classNames(styles.text, variantClass(), toneClass(), local.class)}
    >
      {local.children}
    </Dynamic>
  );
};

export type { TextTone, TextVariant };
export default Text;
