import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Spinner from '../../feedback/Spinner/Spinner';
import styles from './Button.module.css';

interface ButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'danger' | 'ghost' | 'dashed';
  loading?: boolean;
  children: JSX.Element;
}

export type ButtonProps = Props<ButtonOwnProps>;

const Button = (props: Props<ButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['variant', 'loading', 'class', 'children', 'disabled', 'type']);

  return (
    <button
      {...rest}
      type={local.type ?? 'button'}
      class={classNames(
        styles.button,
        styles[local.variant ?? 'primary'],
        local.loading && styles.loading,
        local.class
      )}
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
