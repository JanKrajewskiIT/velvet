import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Spinner from '../../feedback/Spinner/Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'dashed' | 'outline' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  children?: JSX.Element;
}

const Button = (props: Props<ButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'loading',
    'iconOnly',
    'class',
    'children',
    'disabled',
    'type',
  ]);

  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  const iconSizeClass = () => {
    if (local.size === 'sm') return styles.iconSizeSm;
    if (local.size === 'lg') return styles.iconSizeLg;
    return styles.iconSizeMd;
  };

  const variantClass = () => {
    if (local.variant === 'danger') return styles.variantDanger;
    if (local.variant === 'ghost') return styles.variantGhost;
    if (local.variant === 'outline') return styles.variantOutline;
    if (local.variant === 'dashed') return styles.variantDashed;
    if (local.variant === 'subtle') return styles.variantSubtle;
    return styles.variantPrimary;
  };

  const isDisabled = () => Boolean(local.disabled ?? local.loading);

  return (
    <button
      {...rest}
      class={classNames(
        styles.base,
        sizeClass(),
        variantClass(),
        local.iconOnly && styles.iconOnly,
        local.iconOnly && iconSizeClass(),
        local.loading && styles.loading,
        local.class
      )}
      type={local.type ?? 'button'}
      disabled={isDisabled()}
      aria-busy={local.loading ? 'true' : undefined}
    >
      <Show when={local.loading}>
        <span class={styles.spinner}>
          <Spinner size="sm" />
        </span>
      </Show>
      <span class={classNames(styles.content, local.loading && styles.contentHidden)}>{local.children}</span>
    </button>
  );
};

export type { ButtonOwnProps };
export default Button;
