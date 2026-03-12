import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ButtonBase.module.css';

export type ButtonBaseVariant = 'primary' | 'danger' | 'ghost' | 'outline' | 'dashed' | 'subtle';
export type ButtonBaseSize = 'sm' | 'md' | 'lg';

interface ButtonBaseOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonBaseVariant;
  size?: ButtonBaseSize;
  loading?: boolean;
  iconOnly?: boolean;
  children?: JSX.Element;
}

const ButtonBase = (props: Props<ButtonBaseOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'size',
    'loading',
    'iconOnly',
    'disabled',
    'type',
    'children',
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
      type={local.type ?? 'button'}
      class={classNames(
        styles.base,
        sizeClass(),
        variantClass(),
        local.iconOnly && styles.iconOnly,
        local.iconOnly && iconSizeClass(),
        local.loading && styles.loading,
        local.class
      )}
      disabled={isDisabled()}
      aria-busy={local.loading ? 'true' : undefined}
    >
      {local.children}
    </button>
  );
};

export default ButtonBase;
