import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Chip.module.css';

interface ChipProps {
  variant?:
    | 'info'
    | 'warning'
    | 'success'
    | 'error'
    | 'primary'
    | 'primaryOutline'
    | 'subtle';
  size?: 'sm' | 'md';
  selected?: boolean;
  filled?: boolean;
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element;
}

const Chip = (props: Props<ChipProps>) => {
  const classNames = () =>
    `${styles.chip} ${styles[props.variant ?? 'primary']} ${props.size === 'sm' ? styles.sm : ''} ${props.selected ? styles.selected : ''} ${props.filled ? styles.filled : ''} ${props.onClick ? styles.interactive : ''} ${props.class ?? ''}`;

  return (
    <Show
      when={props.onClick}
      fallback={<span class={classNames()}>{props.children}</span>}
    >
      <button
        type="button"
        class={classNames()}
        onClick={(e) => props.onClick?.(e)}
      >
        {props.children}
      </button>
    </Show>
  );
};

export default Chip;
