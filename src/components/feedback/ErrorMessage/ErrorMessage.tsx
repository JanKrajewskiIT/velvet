import { FiAlertCircle } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  children: JSX.Element;
}

const ErrorMessage = (props: Props<ErrorMessageProps>) => {
  return (
    <div class={classNames(styles.error, props.class)}>
      <span class={styles.icon}>
        <FiAlertCircle />
      </span>
      <Text as="p" role="alert" variant="bodySm" class={styles.message}>
        {props.children}
      </Text>
    </div>
  );
};

export default ErrorMessage;
