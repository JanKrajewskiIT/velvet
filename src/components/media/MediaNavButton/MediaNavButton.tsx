import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { type JSX, splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MediaNavButton.module.css';

interface MediaNavButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  direction: 'prev' | 'next';
  title: string;
}

const MediaNavButton = (props: Props<MediaNavButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['direction', 'title', 'class']);

  return (
    <IconButton
      {...rest}
      icon={local.direction === 'prev' ? <FiChevronLeft /> : <FiChevronRight />}
      title={local.title}
      class={classNames(styles.button, local.class)}
      variant="outline"
      size="sm"
    />
  );
};

export type { MediaNavButtonOwnProps };
export default MediaNavButton;
