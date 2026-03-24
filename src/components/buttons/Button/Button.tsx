import { type JSX, Show, splitProps } from 'solid-js';

import Spinner from '~/components/feedback/Spinner/Spinner';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'dashed' | 'outline' | 'subtle' | 'navbar';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  round?: boolean;
  children?: JSX.Element;
}

const sizeToClass: Record<ButtonSize, string | undefined> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const iconSizeToClass: Record<ButtonSize, string | undefined> = {
  sm: styles.iconSizeSm,
  md: styles.iconSizeMd,
  lg: styles.iconSizeLg,
};

const variantToClass: Record<ButtonVariant, string | undefined> = {
  primary: styles.variantPrimary,
  danger: styles.variantDanger,
  ghost: styles.variantGhost,
  dashed: styles.variantDashed,
  outline: styles.variantOutline,
  subtle: styles.variantSubtle,
  navbar: styles.variantNavbar,
};

const Button = (props: Props<ButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'loading',
    'iconOnly',
    'round',
    'class',
    'children',
    'disabled',
    'type',
  ]);

  const sizeClass = () => sizeToClass[local.size ?? 'md'];
  const iconSizeClass = () => iconSizeToClass[local.size ?? 'md'];
  const variantClass = () => variantToClass[local.variant ?? 'primary'];
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
        local.round && styles.round,
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
