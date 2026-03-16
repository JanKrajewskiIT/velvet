import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type { ButtonSize, ButtonVariant } from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './IconActionButton.module.css';

interface IconActionButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  icon: JSX.Element;
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const IconActionButton = (props: Props<IconActionButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size']);

  return <IconButton {...rest} size={local.size ?? 'sm'} class={classNames(styles.iconAction, local.class)} />;
};

export default IconActionButton;
