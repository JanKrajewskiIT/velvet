import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonVariant } from '../Button/Button';
import { type ButtonIcon, renderButtonIcon } from '../shared/renderButtonIcon';
import styles from './IconButton.module.css';

interface IconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: ButtonIcon;
  label: string;
  size?: ComponentSize;
  variant?: ButtonVariant;
  iconSize?: ComponentSize;
  iconVariant?: import('~/components/media/Icon/Icon').IconVariant;
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
  const resolvedIconSize = createMemo<ComponentSize>(() => local.iconSize ?? local.size ?? 'md');
  const renderedIcon = createMemo(() => renderButtonIcon(local.icon, resolvedIconSize(), local.iconVariant));

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
