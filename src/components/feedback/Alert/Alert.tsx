import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'solid-icons/fi';
import { IoFlash } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Alert.module.css';

interface AlertMessages {
  closeButtonLabel?: string;
}

interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error' | 'danger' | 'tip';
  title?: string;
  children: JSX.Element;
  onClose?: () => void;
  icon?: JSX.Element;
  closeLabel?: string;
  messages?: AlertMessages;
}

const defaultIcons: Record<AlertProps['variant'], () => JSX.Element> = {
  info: () => <FiInfo size={20} />,
  success: () => <FiCheckCircle size={20} />,
  warning: () => <FiAlertTriangle size={20} />,
  error: () => <FiAlertCircle size={20} />,
  danger: () => <FiAlertCircle size={20} />,
  tip: () => <IoFlash size={20} />,
};

const Alert = (props: Props<AlertProps>) => {
  const icon = () => props.icon ?? defaultIcons[props.variant]();

  return (
    <div role="alert" class={`${styles.alert} ${styles[props.variant]} ${props.class ?? ''}`}>
      <div class={styles.icon}>{icon()}</div>
      <div class={styles.content}>
        <Show when={props.title}>
          <div class={styles.title}>{props.title}</div>
        </Show>
        <div class={styles.message}>{props.children}</div>
      </div>
      <Show when={props.onClose}>
        <button
          type="button"
          class={styles.closeBtn}
          aria-label={props.messages?.closeButtonLabel ?? props.closeLabel ?? 'Close'}
          onClick={() => props.onClose?.()}
        >
          <FiX size={16} />
        </button>
      </Show>
    </div>
  );
};

export default Alert;
