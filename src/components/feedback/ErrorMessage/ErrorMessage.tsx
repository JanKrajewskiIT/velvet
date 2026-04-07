import { FiAlertCircle } from 'solid-icons/fi';

import Icon from '~/components/media/Icon/Icon';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  children?: never;
}

const ErrorMessage = (props: Props<ErrorMessageProps>) => {
  return (
    <div class={classNames(styles.error, props.class)}>
      <Icon icon={FiAlertCircle} class={styles.icon} />
      <Text as="p" role="alert" variant="bodySm" tone="inherit" class={styles.message}>
        {props.message}
      </Text>
    </div>
  );
};

export default ErrorMessage;
