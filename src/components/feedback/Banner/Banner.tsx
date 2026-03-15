import { FiX } from 'solid-icons/fi';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../inputs/IconButton/IconButton';
import Text from '../../typography/Text/Text';
import styles from './Banner.module.css';

interface BannerMessages {
  closeButtonLabel?: string;
}

interface BannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'primary';
  children: JSX.Element;
  onClose?: () => void;
  action?: JSX.Element;
  closeLabel?: string;
  messages?: BannerMessages;
}

const Banner = (props: Props<BannerProps>) => {
  const variant = () => props.variant ?? 'primary';

  return (
    <div role="status" class={classNames(styles.banner, styles[variant()], props.class)}>
      <Text as="div" variant="labelLg" tone="inverse" class={styles.content}>
        {props.children}
      </Text>
      <Show when={props.action}>
        <div class={styles.action}>{props.action}</div>
      </Show>
      <Show when={props.onClose}>
        <IconButton
          icon={<FiX size={16} />}
          title={props.messages?.closeButtonLabel ?? props.closeLabel ?? 'Close'}
          class={styles.closeBtn}
          onClick={() => props.onClose?.()}
        />
      </Show>
    </div>
  );
};

export default Banner;
