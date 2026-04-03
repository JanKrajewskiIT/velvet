import { createMemo, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import type { HTMLElementCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import { type HeadingVariant, type TypographyTone } from '../Typography/Typography';
import { headingVariantClassByValue, typographyToneClassByValue } from '../Typography/TypographyClasses';
import styles from './Heading.module.css';

interface HeadingOwnProps extends HTMLElementCoreNativeProps {
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

  const level = createMemo(() => local.level ?? 2);
  const component = createMemo(() => local.as ?? (`h${String(level())}` as keyof JSX.IntrinsicElements));
  const variant = createMemo(() => local.variant ?? levelToVariant(level()));
  const headingClass = createMemo(() =>
    classNames(
      styles.heading,
      headingVariantClassByValue[variant()],
      typographyToneClassByValue[local.tone ?? 'default'],
      local.class,
    ),
  );

  return (
    <Dynamic component={component()} {...rest} class={headingClass()}>
      {local.children}
    </Dynamic>
  );
};

export type { HeadingVariant };
export default Heading;
