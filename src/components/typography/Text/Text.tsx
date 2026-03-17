import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { type TextVariant, textVariantClass, toneClass, type TypographyTone } from '../Typography/Typography';
import typographyStyles from '../Typography/Typography.module.css';
import styles from './Text.module.css';

interface TextProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
  tone?: TypographyTone;
  class?: string;
  children?: JSX.Element;
}

const Text = (props: Props<TextProps>) => {
  const [local, rest] = splitProps(props, ['as', 'variant', 'tone', 'class', 'children']);

  return (
    <Dynamic
      component={local.as ?? 'p'}
      {...rest}
      class={classNames(
        styles.text,
        textVariantClass(typographyStyles, local.variant),
        toneClass(typographyStyles, local.tone),
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  );
};

export type { TextVariant };
export default Text;
