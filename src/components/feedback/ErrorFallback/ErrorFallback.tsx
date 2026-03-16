import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import FallbackState from '../FallbackState/FallbackState';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackOwnProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

const ErrorFallback = (props: Props<ErrorFallbackOwnProps>) => {
  return (
    <FallbackState
      class={props.class}
      title={props.title}
      description={props.description}
      titleClass={styles.title}
      descriptionClass={styles.description}
      action={<Button onClick={props.onRetry}>{props.retryLabel}</Button>}
    />
  );
};

export default ErrorFallback;
