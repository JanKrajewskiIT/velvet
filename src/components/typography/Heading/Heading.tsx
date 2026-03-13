import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Heading.module.css';

type HeadingVariant = 'displayLg' | 'displayMd' | 'h1' | 'h2' | 'h3' | 'titleLg' | 'titleMd';
type HeadingTone = 'default' | 'muted' | 'secondary' | 'tertiary' | 'inverse' | 'primary';

interface HeadingOwnProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: HeadingVariant;
  tone?: HeadingTone;
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
      component={component()}
      {...rest}
      class={classNames(styles.heading, variantClass(), toneClass(), local.class)}
    >
      {local.children}
    </Dynamic>
  );
};

export type { HeadingTone, HeadingVariant };
export default Heading;
