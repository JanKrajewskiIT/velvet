import type { IconTypes } from 'solid-icons';
import { type JSX, splitProps } from 'solid-js';

import Icon, { type IconVariant } from '~/components/media/Icon/Icon';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonVariant } from '../Button/Button';
import styles from './RoundIconButton.module.css';

type RoundIconButtonElevation = 'popover' | 'glow';
type RoundIconButtonIcon = IconTypes | JSX.Element;

interface RoundIconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: RoundIconButtonIcon;
  label: string;
  size?: ComponentSize;
  variant?: ButtonVariant;
  elevation?: RoundIconButtonElevation;
  iconSize?: ComponentSize;
  iconVariant?: IconVariant;
}

const RoundIconButton = (props: Props<RoundIconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'label',
    'size',
    'variant',
    'elevation',
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
      class={classNames(styles.button, styles[local.elevation ?? 'popover'], local.class)}
      type={local.type ?? 'button'}
      size={local.size}
      variant={local.variant ?? 'primary'}
      round
      title={local.label}
      aria-label={local.label}
      iconOnly
    >
      {renderedIcon()}
    </Button>
  );
};

export type { RoundIconButtonElevation, RoundIconButtonOwnProps };
export default RoundIconButton;
