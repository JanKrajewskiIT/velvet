import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Spinner from '../Spinner/Spinner';
import styles from './LoadingContainer.module.css';

interface LoadingContainerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const LoadingContainer = (props: Props<LoadingContainerProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'label']);

  return (
    <div {...rest} class={classNames(styles.container, local.class)}>
      <Spinner size={local.size} label={local.label} />
    </div>
  );
};

export default LoadingContainer;
