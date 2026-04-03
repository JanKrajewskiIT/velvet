import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataCard.module.css';

interface DataCardOwnProps extends DivCoreNativeProps {
  media?: JSX.Element;
  header?: JSX.Element;
  footer?: JSX.Element;
  children: JSX.Element;
  variant?: 'filled' | 'elevated' | 'outlined';
  hoverable?: boolean;
}

const DataCard = (props: Props<DataCardOwnProps>) => {
  const [local, rest] = splitProps(props, ['media', 'header', 'footer', 'children', 'variant', 'hoverable', 'class']);
  const variantClass = createMemo(() => {
    if (local.variant === 'filled') return styles.filled;
    if (local.variant === 'outlined') return styles.outlined;
    return styles.elevated;
  });
  const cardClass = createMemo(() =>
    classNames(styles.card, variantClass(), local.hoverable && styles.hoverable, local.class),
  );

  return (
    <div {...rest} class={cardClass()}>
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
