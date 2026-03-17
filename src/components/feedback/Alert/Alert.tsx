import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'solid-icons/fi';
import { IoFlash } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
  const visualVariant = () => (props.variant === 'danger' ? 'error' : props.variant);

  return (
    <div role="alert" class={classNames(styles.alert, styles[visualVariant()], props.class)}>
      <div class={styles.icon}>{icon()}</div>
      <div class={styles.content}>
        <Show when={props.title}>
          <Heading as="div" level={4} variant="titleMd" class={styles.title}>
            {props.title}
          </Heading>
        </Show>
        <Text as="div" variant="bodySm" tone="secondary" class={styles.message}>
          {props.children}
        </Text>
      </div>
      <Show when={props.onClose}>
        <IconButton
          icon={<FiX size={16} />}
          title={props.messages?.closeButtonLabel ?? props.closeLabel ?? 'Close'}
          class={styles.closeBtn}
          onClick={props.onClose}
          variant="subtle"
          size="sm"
        />
      </Show>
    </div>
  );
};

export default Alert;
