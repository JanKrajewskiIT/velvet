import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Spinner from '../../feedback/Spinner/Spinner';
import ButtonBase, { type ButtonBaseSize } from '../shared/ButtonBase';
import styles from './Button.module.css';

interface ButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'danger' | 'ghost' | 'dashed';
  size?: ButtonBaseSize;
  loading?: boolean;
  children: JSX.Element;
}

export type ButtonProps = Props<ButtonOwnProps>;

const Button = (props: Props<ButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['variant', 'size', 'loading', 'class', 'children', 'disabled', 'type']);

  return (
    <ButtonBase
      {...rest}
      type={local.type ?? 'button'}
      variant={local.variant}
      size={local.size}
      loading={local.loading}
      disabled={local.disabled}
      class={classNames(local.loading && styles.loading, local.class)}
    >
      <Show when={local.loading}>
        <span class={styles.spinner}>
          <Spinner size="sm" />
        </span>
      </Show>
      <span class={classNames(styles.content, local.loading && styles.contentHidden)}>{local.children}</span>
    </ButtonBase>
  );
};

export default Button;
