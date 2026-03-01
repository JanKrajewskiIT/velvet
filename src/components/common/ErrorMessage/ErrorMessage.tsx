import { FiAlertCircle } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  children: JSX.Element;
}

const ErrorMessage = (props: Props<ErrorMessageProps>) => {
  return (
    <p role="alert" class={`${styles.error} ${props.class ?? ''}`}>
      <span class={styles.icon}>
        <FiAlertCircle />
      </span>
      {props.children}
    </p>
  );
};

export default ErrorMessage;
