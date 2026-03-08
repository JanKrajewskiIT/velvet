import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';

import Spinner from '../Spinner/Spinner';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'danger' | 'ghost' | 'dashed';
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: JSX.Element;
}

const Button = (props: Props<ButtonProps>) => {
  return (
    <button
      type={props.type ?? 'button'}
      class={`${styles.button} ${styles[props.variant ?? 'primary']} ${props.loading ? styles.loading : ''} ${props.class ?? ''}`}
      onClick={(e) => props.onClick?.(e)}
      disabled={props.disabled ?? props.loading}
    >
      <Show when={props.loading}>
        <span class={styles.spinner}>
          <Spinner size="sm" />
        </span>
      </Show>
      {props.children}
    </button>
  );
};

export default Button;
