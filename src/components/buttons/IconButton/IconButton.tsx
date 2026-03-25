import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './IconButton.module.css';

interface IconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: JSX.Element;
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const IconButton = (props: Props<IconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'label', 'size', 'variant', 'class', 'type']);

  return (
    <Button
      {...rest}
      class={classNames(styles.iconButton, local.class)}
      type={local.type ?? 'button'}
      size={local.size}
      variant={local.variant ?? 'subtle'}
      iconOnly
      title={local.label}
      aria-label={local.label}
    >
      {local.icon}
    </Button>
  );
};

export default IconButton;
