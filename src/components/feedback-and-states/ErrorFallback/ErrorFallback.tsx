import type Props from '~/models/Props';

import Button from '../../actions-and-forms/Button/Button';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackOwnProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

const ErrorFallback = (props: Props<ErrorFallbackOwnProps>) => {
  return (
    <div class={`${styles.page} ${props.class ?? ''}`}>
      <h1 class={styles.title}>{props.title}</h1>
      <p class={styles.description}>{props.description}</p>
      <Button onClick={() => props.onRetry()}>{props.retryLabel}</Button>
    </div>
  );
};

export default ErrorFallback;
