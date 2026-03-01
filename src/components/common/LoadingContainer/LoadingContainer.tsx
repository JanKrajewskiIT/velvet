import type Props from '../../../models/Props';

import Spinner from '../Spinner/Spinner';
import styles from './LoadingContainer.module.css';

interface LoadingContainerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingContainer = (props: Props<LoadingContainerProps>) => {
  return (
    <div class={`${styles.container} ${props.class ?? ''}`}>
      <Spinner size={props.size} />
    </div>
  );
};

export default LoadingContainer;
