import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../inputs/Button/Button';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackOwnProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

const ErrorFallback = (props: Props<ErrorFallbackOwnProps>) => {
  return (
    <div class={classNames(styles.page, props.class)}>
      <Heading as="h1" level={1} class={styles.title}>
        {props.title}
      </Heading>
      <Text tone="muted" class={styles.description}>
        {props.description}
      </Text>
      <Button onClick={() => props.onRetry()}>{props.retryLabel}</Button>
    </div>
  );
};

export default ErrorFallback;
