import { IoClose } from 'solid-icons/io';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { removeToast, toasts } from '../Toast';
import styles from './ToastViewport.module.css';

const toastTypeClassByValue = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
  warning: styles.warning,
} as const;

const ToastViewport = (props: Props) => {
  const { ts } = useI18n();

  return (
    <Portal>
      <div class={classNames(styles.toastContainer, props.class)} role="region" aria-live="polite" aria-atomic="false">
        <For each={toasts()}>
          {(toast) => (
            <div
              class={classNames(styles.toast, toastTypeClassByValue[toast.type])}
              role={toast.type === 'error' ? 'alert' : 'status'}
              style={{ '--toast-duration': `${toast.duration !== undefined ? toast.duration : 3000}ms` }}
            >
              <Text as="span" variant="bodySm" tone="inherit">
                {toast.message}
              </Text>
              <IconButton icon={IoClose} label={ts('common.close')} onClick={() => removeToast(toast.id)} />
              <div class={styles.progressBar} />
            </div>
          )}
        </For>
      </div>
    </Portal>
  );
};

export default ToastViewport;
