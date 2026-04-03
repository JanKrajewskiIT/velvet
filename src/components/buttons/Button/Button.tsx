import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import Spinner from '~/components/feedback/Spinner/Spinner';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize, LabelOnlyProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'dashed' | 'outline' | 'subtle' | 'navbar';

interface ButtonBaseProps extends Omit<ButtonCoreNativeProps, 'children'> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  loading?: boolean;
  iconOnly?: boolean;
  round?: boolean;
}

type ButtonLabelProps = ButtonBaseProps & LabelOnlyProps;

type ButtonChildrenProps = ButtonBaseProps & {
  children: JSX.Element;
  label?: never;
};

type ButtonOwnProps = ButtonLabelProps | ButtonChildrenProps;

const sizeToClass: Record<ComponentSize, string | undefined> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const iconSizeToClass: Record<ComponentSize, string | undefined> = {
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
    'label',
    'disabled',
    'type',
  ]);

  const sizeClass = createMemo(() => sizeToClass[local.size ?? 'md']);
  const iconSizeClass = createMemo(() => iconSizeToClass[local.size ?? 'md']);
  const variantClass = createMemo(() => variantToClass[local.variant ?? 'primary']);
  const isDisabled = createMemo(() => Boolean(local.disabled ?? local.loading));
  const hasLabel = createMemo(() => typeof local.label === 'string');
  const content = createMemo(() =>
    hasLabel() ? (
      <Text as="span" variant="labelMd" tone="inherit">
        {local.label}
      </Text>
    ) : (
      local.children
    ),
  );

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
        local.class,
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
      <span class={classNames(styles.content, local.loading && styles.contentHidden)}>{content()}</span>
    </button>
  );
};

export type { ButtonOwnProps };
export default Button;
