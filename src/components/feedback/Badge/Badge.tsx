import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Badge.module.css';

interface BadgeProps {
  content?: string | number;
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'error';
  max?: number;
  dot?: boolean;
  children: JSX.Element;
}

const Badge = (props: Props<BadgeProps>) => {
  const variantClass = () => styles[props.variant ?? 'primary'];

  const displayContent = () => {
    const val = props.content;
    if (val === undefined) return '';
    if (typeof val === 'number' && props.max !== undefined && val > props.max) return `${props.max}+`;
    return String(val);
  };

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      {props.children}
      <Show when={props.dot}>
        <span class={classNames(styles.badge, styles.dot, variantClass())} />
      </Show>
      <Show when={!props.dot && props.content !== undefined}>
        <span class={classNames(styles.badge, variantClass())}>{displayContent()}</span>
      </Show>
    </div>
  );
};

export default Badge;
