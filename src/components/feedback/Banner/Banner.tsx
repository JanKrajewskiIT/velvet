import { FiX } from 'solid-icons/fi';
import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Stack from '~/components/surfaces/Stack/Stack';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Banner.module.css';

interface BannerMessages {
  closeButtonLabel?: string;
}

interface BannerProps extends DivCoreNativeProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'primary';
  message: string;
  children?: never;
  onClose?: () => void;
  action?: JSX.Element;
  closeLabel?: string;
  messages?: BannerMessages;
}

const Banner = (props: Props<BannerProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'message',
    'onClose',
    'action',
    'closeLabel',
    'messages',
  ]);
  const variant = createMemo(() => local.variant ?? 'primary');
  const closeButtonLabel = createMemo(() => local.messages?.closeButtonLabel ?? local.closeLabel ?? t('common.close'));

  return (
    <Stack
      {...rest}
      direction="horizontal"
      align="center"
      justify="between"
      gap="md"
      role={rest.role ?? 'status'}
      class={classNames(styles.banner, styles[variant()], local.class)}
    >
      <Stack direction="horizontal" align="center" gap="md" wrap class={styles.body}>
        <Text as="div" variant="labelLg" tone="inherit" class={styles.content}>
          {local.message}
        </Text>
        <Show when={local.action}>
          <div class={styles.action}>{local.action}</div>
        </Show>
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

export default Banner;
