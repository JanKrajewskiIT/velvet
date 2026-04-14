import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../Button/Button';
import { type ButtonVariant, DEFAULT_ROUND_ICON_BUTTON_VARIANT } from '../shared/buttonVariants';
import { type ButtonIcon, renderButtonIcon } from '../shared/renderButtonIcon';
import styles from './RoundIconButton.module.css';

type RoundIconButtonElevation = 'popover' | 'glow';

const elevationClassByValue: Record<RoundIconButtonElevation, string | undefined> = {
  popover: styles.popover,
  glow: styles.glow,
};

interface RoundIconButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'title'> {
  icon: ButtonIcon;
  label: string;
  size?: ComponentSize;
  variant?: ButtonVariant;
  elevation?: RoundIconButtonElevation;
  iconSize?: ComponentSize;
  iconVariant?: import('~/components/media/Icon/Icon').IconVariant;
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
  const resolvedIconSize = createMemo<ComponentSize>(() => local.iconSize ?? local.size ?? 'md');
  const renderedIcon = createMemo(() => renderButtonIcon(local.icon, resolvedIconSize(), local.iconVariant));

  return (
    <Button
      {...rest}
      class={classNames(styles.button, elevationClassByValue[local.elevation ?? 'popover'], local.class)}
      type={local.type ?? 'button'}
      size={local.size}
      variant={local.variant ?? DEFAULT_ROUND_ICON_BUTTON_VARIANT}
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
