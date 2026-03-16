import { FiAlertCircle } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  children: JSX.Element;
}

const ErrorMessage = (props: Props<ErrorMessageProps>) => {
  return (
    <Text as="p" role="alert" class={classNames(styles.error, props.class)}>
      <span class={styles.icon}>
        <FiAlertCircle />
      </span>
      {props.children}
    </Text>
  );
};

export default ErrorMessage;
