import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Badge.module.css';

interface BadgeProps {
  content?: string | number;
  variant?: 'primary' | 'primarySoft' | 'info' | 'success' | 'warning' | 'error';
  max?: number;
  dot?: boolean;
  inline?: boolean;
  children: JSX.Element;
}

const Badge = (props: Props<BadgeProps>) => {
  const [local, rest] = splitProps(props, ['class', 'content', 'variant', 'max', 'dot', 'inline', 'children']);
  const variantClass = createMemo(() => styles[local.variant ?? 'primary']);
  const displayContent = createMemo(() => {
    const value = local.content;
    if (value === undefined) return '';
    if (typeof value === 'number' && local.max !== undefined && value > local.max) return `${local.max}+`;

    return String(value);
  });
  const showContent = createMemo(() => !local.dot && local.content !== undefined);

  return (
    <div {...rest} class={classNames(styles.wrapper, local.inline && styles.inlineWrapper, local.class)}>
      {local.children}
      <Show when={local.dot}>
        <span class={classNames(styles.badge, local.inline && styles.inlineBadge, styles.dot, variantClass())} />
      </Show>
      <Show when={showContent()}>
        <span class={classNames(styles.badge, local.inline && styles.inlineBadge, variantClass())}>
          {displayContent()}
        </span>
      </Show>
    </div>
  );
};

export default Badge;
