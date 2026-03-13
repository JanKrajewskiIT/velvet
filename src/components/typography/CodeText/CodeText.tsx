import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CodeText.module.css';

type CodeTextVariant = 'inline' | 'block';
type CodeTextSize = 'sm' | 'md';

interface CodeTextOwnProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: CodeTextVariant;
  size?: CodeTextSize;
}

const CodeText = (props: Props<CodeTextOwnProps>) => {
  const [local, rest] = splitProps(props, ['as', 'variant', 'size', 'class', 'children']);

  const variant = () => local.variant ?? 'inline';
  const component = () => {
    if (local.as) return local.as;
    return variant() === 'block' ? 'pre' : 'code';
  };

  return (
    <Dynamic
      component={component()}
      {...rest}
      class={classNames(
        styles.codeText,
        variant() === 'block' ? styles.block : styles.inline,
        local.size === 'md' ? styles.sizeMd : styles.sizeSm,
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  );
};

export type { CodeTextSize, CodeTextVariant };
export default CodeText;
