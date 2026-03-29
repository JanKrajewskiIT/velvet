import { createMemo, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import type { AnchorCoreNativeProps } from '~/models/Props';
import type { HTMLElementCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import { type TextVariant, textVariantClass, toneClass, type TypographyTone } from '../Typography/Typography';
import typographyStyles from '../Typography/Typography.module.css';
import styles from './Text.module.css';

interface TextProps extends HTMLElementCoreNativeProps, AnchorCoreNativeProps {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
  tone?: TypographyTone;
  class?: string;
  children?: JSX.Element;
}

const Text = (props: Props<TextProps>) => {
  const [local, rest] = splitProps(props, ['as', 'variant', 'tone', 'class', 'children']);
  const component = createMemo(() => local.as ?? 'p');
  const textClass = createMemo(() =>
    classNames(
      styles.text,
      textVariantClass(typographyStyles, local.variant),
      toneClass(typographyStyles, local.tone),
      local.class
    )
  );

  return (
    <Dynamic component={component()} {...rest} class={textClass()}>
      {local.children}
    </Dynamic>
  );
};

export type { TextVariant };
export default Text;
