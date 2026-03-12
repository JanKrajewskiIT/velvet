import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ButtonBase from '../shared/ButtonBase';
import styles from './IconButton.module.css';

interface IconButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  icon: JSX.Element;
  title: string;
  size?: 'sm' | 'md';
}

const IconButton = (props: Props<IconButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'title', 'size', 'class', 'type']);

  return (
    <ButtonBase
      {...rest}
      type={local.type ?? 'button'}
      size={local.size}
      variant="subtle"
      iconOnly
      class={classNames(styles.iconButton, local.class)}
      title={local.title}
      aria-label={local.title}
    >
      {local.icon}
    </ButtonBase>
  );
};

export default IconButton;
