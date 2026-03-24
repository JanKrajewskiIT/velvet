import { children, createMemo, For, type JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { AvatarSize } from './Avatar';
import avatarStyles from './Avatar.module.css';
import styles from './AvatarGroup.module.css';

interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  children: JSX.Element;
}

const AvatarGroup = (props: Props<AvatarGroupProps>) => {
  const resolved = children(() => props.children);

  const items = createMemo(() => {
    const all = resolved.toArray();
    const max = props.max ?? 5;
    return { visible: all.slice(0, max), overflow: Math.max(0, all.length - max) };
  });

  const sizeClass = () => avatarStyles[props.size ?? 'md'];
  const overflowCount = () => items().overflow;
  const visibleItems = () => [...items().visible].reverse();

  return (
    <div class={classNames(styles.group, props.class)}>
      {overflowCount() > 0 && (
        <span class={classNames(styles.overflow, styles.item, sizeClass())}>+{overflowCount()}</span>
      )}
      <For each={visibleItems()}>{(child) => <span class={styles.item}>{child}</span>}</For>
    </div>
  );
};

export default AvatarGroup;
