import { type JSX, Show, splitProps } from 'solid-js';

import Spinner from '../../feedback-and-states/Spinner/Spinner';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  variant?: 'primary' | 'danger' | 'ghost' | 'dashed';
  loading?: boolean;
  children: JSX.Element;
}

const Button = (props: ButtonProps) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'loading',
    'class',
    'children',
    'disabled',
    'type',
  ]);

  return (
    <button
      {...rest}
      type={local.type ?? 'button'}
      class={`${styles.button} ${styles[local.variant ?? 'primary']} ${local.loading ? styles.loading : ''} ${local.class ?? ''}`}
      disabled={Boolean(local.disabled ?? local.loading)}
      aria-busy={local.loading ? 'true' : undefined}
    >
      <Show when={local.loading}>
        <span class={styles.spinner}>
          <Spinner size="sm" />
        </span>
      </Show>
      {local.children}
    </button>
  );
};

export default Button;
