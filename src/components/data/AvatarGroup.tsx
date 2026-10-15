import { splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './AvatarGroup.module.css';

export type AvatarGroupProps = HtmlProps<HTMLSpanElement>;

/** Overlapping stack of Avatars. */
export const AvatarGroup = (props: AvatarGroupProps) => {
  const [local, rest] = splitProps(props, ['class']);
  return <span {...rest} class={cx(styles.avatarGroup, local.class)} />;
};
