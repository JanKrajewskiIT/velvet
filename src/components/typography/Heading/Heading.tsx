import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { toneClass, type TypographyTone } from '../Typography/Typography';
import styles from './Heading.module.css';

type HeadingVariant = 'displayLg' | 'displayMd' | 'h1' | 'h2' | 'h3' | 'titleLg' | 'titleMd';

interface HeadingOwnProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: HeadingVariant;
  tone?: TypographyTone;
}

const levelToVariant = (level: number): HeadingVariant => {
  if (level === 1) return 'h1';
  if (level === 2) return 'h2';
  if (level === 3) return 'h3';
  if (level === 4) return 'titleLg';
  return 'titleMd';
};

const Heading = (props: Props<HeadingOwnProps>) => {
  const [local, rest] = splitProps(props, ['as', 'level', 'variant', 'tone', 'class', 'children']);

  const level = () => local.level ?? 2;
  const component = () => local.as ?? (`h${String(level())}` as keyof JSX.IntrinsicElements);
  const variant = () => local.variant ?? levelToVariant(level());

  const variantClass = () => {
    if (variant() === 'displayLg') return styles.displayLg;
    if (variant() === 'displayMd') return styles.displayMd;
    if (variant() === 'h1') return styles.h1;
    if (variant() === 'h2') return styles.h2;
    if (variant() === 'h3') return styles.h3;
    if (variant() === 'titleLg') return styles.titleLg;
    return styles.titleMd;
  };

  return (
    <Dynamic
      component={component()}
      {...rest}
      class={classNames(styles.heading, variantClass(), toneClass(styles, local.tone), local.class)}
    >
      {local.children}
    </Dynamic>
  );
};

export type { HeadingVariant };
export default Heading;
