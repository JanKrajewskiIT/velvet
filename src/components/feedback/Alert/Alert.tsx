import type { IconTypes } from 'solid-icons';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'solid-icons/fi';
import { IoFlash } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Icon from '~/components/media/Icon/Icon';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Alert.module.css';

interface AlertMessages {
  closeButtonLabel?: string;
}

interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error' | 'danger' | 'tip';
  label?: string;
  message: string;
  children?: never;
  onClose?: () => void;
  icon?: JSX.Element | IconTypes;
  closeLabel?: string;
  messages?: AlertMessages;
}

const defaultIcons: Record<AlertProps['variant'], IconTypes> = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiAlertCircle,
  danger: FiAlertCircle,
  tip: IoFlash,
};

const renderAlertIcon = (icon: JSX.Element | IconTypes): JSX.Element => {
  if (typeof icon === 'function') {
    return <Icon icon={icon} />;
  }

  return icon;
};

const Alert = (props: Props<AlertProps>) => {
  const { t } = useI18n();
  const icon = () => props.icon ?? defaultIcons[props.variant];
  const visualVariant = () => (props.variant === 'danger' ? 'error' : props.variant);
  const renderedIcon = () => renderAlertIcon(icon());

  return (
    <div role="alert" class={classNames(styles.alert, styles[visualVariant()], props.class)}>
      <div class={styles.icon}>{renderedIcon()}</div>
      <div class={styles.content}>
        <Show when={props.label}>
          <Heading as="div" level={4} variant="titleMd">
            {props.label}
          </Heading>
        </Show>
        <Text as="div" variant="bodySm" tone="secondary">
          {props.message}
        </Text>
      </div>
      <Show when={props.onClose}>
        <IconButton
          icon={FiX}
          label={props.messages?.closeButtonLabel ?? props.closeLabel ?? t('common.close')}
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
