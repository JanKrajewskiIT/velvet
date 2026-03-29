import type { IconTypes } from 'solid-icons';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'solid-icons/fi';
import { IoFlash } from 'solid-icons/io';
import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Icon from '~/components/media/Icon/Icon';
import Stack from '~/components/surfaces/Stack/Stack';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Alert.module.css';

interface AlertMessages {
  closeButtonLabel?: string;
}

interface AlertProps extends DivCoreNativeProps {
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
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'label',
    'message',
    'onClose',
    'icon',
    'closeLabel',
    'messages',
  ]);
  const icon = createMemo(() => local.icon ?? defaultIcons[local.variant]);
  const visualVariant = createMemo(() => (local.variant === 'danger' ? 'error' : local.variant));
  const renderedIcon = createMemo(() => renderAlertIcon(icon()));
  const closeButtonLabel = createMemo(() => local.messages?.closeButtonLabel ?? local.closeLabel ?? t('alert.close'));

  return (
    <Stack
      {...rest}
      direction="horizontal"
      align="start"
      gap="md"
      role={rest.role ?? 'alert'}
      class={classNames(styles.alert, styles[visualVariant()], local.class)}
    >
      <div class={styles.icon}>{renderedIcon()}</div>
      <Stack gap="2xs" class={styles.content}>
        <Show when={local.label}>
          <Heading as="div" level={4} variant="titleMd" tone="inherit" class={styles.label}>
            {local.label}
          </Heading>
        </Show>
        <Text as="div" variant="bodySm" tone="inherit" class={styles.message}>
          {local.message}
        </Text>
      </Stack>
      <Show when={local.onClose}>
        <IconButton
          icon={FiX}
          label={closeButtonLabel()}
          class={styles.closeBtn}
          onClick={local.onClose}
          variant="subtle"
          size="sm"
        />
      </Show>
    </Stack>
  );
};

export default Alert;
