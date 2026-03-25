import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './RoundIconButton.module.css';

type RoundIconButtonElevation = 'popover' | 'glow';

interface RoundIconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: JSX.Element;
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  elevation?: RoundIconButtonElevation;
}

const RoundIconButton = (props: Props<RoundIconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'label', 'size', 'variant', 'elevation', 'class', 'type']);

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
      {local.icon}
    </Button>
  );
};

export type { RoundIconButtonElevation, RoundIconButtonOwnProps };
export default RoundIconButton;
