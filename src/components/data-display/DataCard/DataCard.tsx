import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './DataCard.module.css';

interface DataCardOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  media?: JSX.Element;
  header?: JSX.Element;
  footer?: JSX.Element;
  children: JSX.Element;
  variant?: 'elevated' | 'outlined';
  hoverable?: boolean;
}

const DataCard = (props: Props<DataCardOwnProps>) => {
  const [local, rest] = splitProps(props, ['media', 'header', 'footer', 'children', 'variant', 'hoverable', 'class']);

  const variantClass = () => (local.variant === 'outlined' ? styles.outlined : styles.elevated);

  const hoverableClass = () => (local.hoverable ? styles.hoverable : '');

  return (
    <div class={`${styles.card} ${variantClass()} ${hoverableClass()} ${local.class ?? ''}`} {...rest}>
      <Show when={local.media}>
        <div class={styles.media}>{local.media}</div>
      </Show>
      <Show when={local.header}>
        <div class={styles.header}>{local.header}</div>
      </Show>
      <div class={styles.body}>{local.children}</div>
      <Show when={local.footer}>
        <div class={styles.footer}>{local.footer}</div>
      </Show>
    </div>
  );
};

export default DataCard;
