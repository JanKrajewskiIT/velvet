import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MediaNavButton.module.css';

interface MediaNavButtonOwnProps extends Omit<ButtonCoreNativeProps, 'title' | 'children'> {
  direction: 'prev' | 'next';
  label: string;
}

const MediaNavButton = (props: Props<MediaNavButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['direction', 'label', 'class']);

  return (
    <IconButton
      {...rest}
      icon={local.direction === 'prev' ? <FiChevronLeft /> : <FiChevronRight />}
      label={local.label}
      class={classNames(styles.button, local.class)}
      variant="outline"
      size="sm"
    />
  );
};

export type { MediaNavButtonOwnProps };
export default MediaNavButton;
