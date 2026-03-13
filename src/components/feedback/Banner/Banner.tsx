import { FiX } from 'solid-icons/fi';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';

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
    <div role="status" class={`${styles.banner} ${styles[variant()]} ${props.class ?? ''}`}>
      <Text as="div" variant="labelLg" tone="inverse" class={styles.content}>
        {props.children}
      </Text>
      <Show when={props.action}>
        <div class={styles.action}>{props.action}</div>
      </Show>
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

export default Banner;
