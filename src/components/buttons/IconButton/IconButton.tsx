import type { IconTypes } from 'solid-icons';
import { type JSX, splitProps } from 'solid-js';

import Icon, { type IconVariant } from '~/components/media/Icon/Icon';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonVariant } from '../Button/Button';
import styles from './IconButton.module.css';

type IconButtonIcon = IconTypes | JSX.Element;

interface IconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: IconButtonIcon;
  label: string;
  size?: ComponentSize;
  variant?: ButtonVariant;
  iconSize?: ComponentSize;
  iconVariant?: IconVariant;
}

const IconButton = (props: Props<IconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'label',
    'size',
    'variant',
    'iconSize',
    'iconVariant',
    'class',
    'type',
  ]);
  const resolvedIconSize = (): ComponentSize => local.iconSize ?? local.size ?? 'md';
  const renderedIcon = () =>
    typeof local.icon === 'function' ? (
      <Icon icon={local.icon} size={resolvedIconSize()} variant={local.iconVariant} />
    ) : (
      local.icon
    );

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
      {renderedIcon()}
    </Button>
  );
};

export default IconButton;
