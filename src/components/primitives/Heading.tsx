import { splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './Heading.module.css';
import { Text, type TextProps } from './Text';
import { HEADING_ROLES, type HeadingVariant } from './typography';

const HEADING_LEVELS = {
  1: { tag: HEADING_ROLES.h1, variant: 'h1' },
  2: { tag: HEADING_ROLES.h2, variant: 'h2' },
  3: { tag: HEADING_ROLES.h3, variant: 'h3' },
  4: { tag: HEADING_ROLES.h4, variant: 'h4' },
  5: { tag: HEADING_ROLES.h5, variant: 'h5' },
  6: { tag: 'h6', variant: 'h5' },
} as const satisfies Record<number, { tag: NonNullable<TextProps['as']>; variant: HeadingVariant }>;

export type HeadingLevel = keyof typeof HEADING_LEVELS;
export type { HeadingVariant } from './typography';

export interface HeadingProps extends Omit<TextProps, 'as' | 'variant' | 'for' | 'dateTime' | 'datetime'> {
  level: HeadingLevel;
  /** Visual role, independent of the document level. Level 6 defaults to h5. */
  variant?: HeadingVariant;
}

export const Heading = (props: HeadingProps) => {
  const [local, rest] = splitProps(props, ['level', 'variant', 'class']);
  return (
    <Text
      {...rest}
      class={cx(styles.root, local.class)}
      as={HEADING_LEVELS[local.level].tag}
      variant={local.variant ?? HEADING_LEVELS[local.level].variant}
    />
  );
};
