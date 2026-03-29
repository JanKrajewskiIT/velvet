import { createMemo, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import type { HTMLElementCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import { toneClass, type TypographyTone } from '../Typography/Typography';
import typographyStyles from '../Typography/Typography.module.css';
import styles from './CodeText.module.css';

type CodeTextVariant = 'inline' | 'block';
type CodeTextSize = 'sm' | 'md';

interface CodeTextOwnProps extends HTMLElementCoreNativeProps {
  as?: keyof JSX.IntrinsicElements;
  variant?: CodeTextVariant;
  size?: CodeTextSize;
  tone?: TypographyTone;
}

const CodeText = (props: Props<CodeTextOwnProps>) => {
  const [local, rest] = splitProps(props, ['as', 'variant', 'size', 'tone', 'class', 'children']);
  const variant = createMemo(() => local.variant ?? 'inline');

  const component = createMemo(() => {
    if (local.as) return local.as;
    return variant() === 'block' ? 'pre' : 'code';
  });

  const resolvedTone = createMemo(() => local.tone ?? (variant() === 'block' ? 'default' : 'secondary'));

  const composedClass = createMemo(() =>
    classNames(
      styles.codeText,
      variant() === 'block' ? styles.block : styles.inline,
      local.size === 'md' ? styles.sizeMd : styles.sizeSm,
      toneClass(typographyStyles, resolvedTone()),
      local.class
    )
  );

  return (
    <Dynamic component={component()} {...rest} class={composedClass()}>
      {local.children}
    </Dynamic>
  );
};

export type { CodeTextSize, CodeTextVariant };
export default CodeText;
