import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './RoundIconButton.module.css';

type RoundIconButtonElevation = 'popover' | 'glow';

interface RoundIconButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  icon: JSX.Element;
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  elevation?: RoundIconButtonElevation;
}

const RoundIconButton = (props: Props<RoundIconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'title', 'size', 'variant', 'elevation', 'class', 'type']);

  return (
    <Button
      {...rest}
      class={classNames(styles.button, styles[local.elevation ?? 'popover'], local.class)}
      type={local.type ?? 'button'}
      size={local.size}
      variant={local.variant ?? 'primary'}
      round
      title={local.title}
      aria-label={local.title}
      iconOnly
    >
      {local.icon}
    </Button>
  );
};

export type { RoundIconButtonElevation, RoundIconButtonOwnProps };
export default RoundIconButton;
