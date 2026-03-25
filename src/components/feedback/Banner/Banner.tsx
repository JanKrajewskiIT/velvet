import { FiX } from 'solid-icons/fi';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Banner.module.css';

interface BannerMessages {
  closeButtonLabel?: string;
}

interface BannerProps {
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
  const variant = () => props.variant ?? 'primary';

  return (
    <div role="status" class={classNames(styles.banner, styles[variant()], props.class)}>
      <Text as="div" variant="labelLg" tone="inverse" class={styles.content}>
        {props.message}
      </Text>
      <Show when={props.action}>
        <div class={styles.action}>{props.action}</div>
      </Show>
      <Show when={props.onClose}>
        <IconButton
          icon={<FiX size={16} />}
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

export default Banner;
