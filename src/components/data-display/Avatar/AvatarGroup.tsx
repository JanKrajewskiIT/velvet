import { children, For, type JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './AvatarGroup.module.css';

interface AvatarGroupProps {
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: JSX.Element;
}

const AvatarGroup = (props: Props<AvatarGroupProps>) => {
  const resolved = children(() => props.children);

  const items = () => {
    const all = resolved.toArray();
    const max = props.max ?? 5;
    return { visible: all.slice(0, max), overflow: Math.max(0, all.length - max) };
  };

  const sizeClass = () => styles[props.size ?? 'md'];

  return (
    <div class={`${styles.group} ${props.class ?? ''}`}>
      {items().overflow > 0 && (
        <span class={`${styles.overflow} ${styles.item} ${sizeClass()}`}>+{items().overflow}</span>
      )}
      <For each={[...items().visible].reverse()}>{(child) => <span class={styles.item}>{child}</span>}</For>
    </div>
  );
};

export default AvatarGroup;
