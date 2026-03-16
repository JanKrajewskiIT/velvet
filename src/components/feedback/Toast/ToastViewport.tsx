import { IoClose } from 'solid-icons/io';
import { For } from 'solid-js';

import type Props from '~/models/Props';

import IconButton from '../../buttons/IconButton/IconButton';
import Text from '../../typography/Text/Text';
import { removeToast, toasts } from './Toast';
import styles from './Toast.module.css';

interface ToastViewportBaseProps {
  closeLabel: string;
}

const ToastViewport = (props: Props<ToastViewportBaseProps>) => {
  return (
    <div class={`${styles.toastContainer} ${props.class ?? ''}`} role="region" aria-live="polite" aria-atomic="false">
      <For each={toasts()}>
        {(toast) => (
          <div class={`${styles.toast} ${styles[toast.type]}`} role={toast.type === 'error' ? 'alert' : 'status'}>
            <Text as="span" variant="bodyMd" class={styles.message}>
              {toast.message}
            </Text>
            <IconButton icon={<IoClose />} title={props.closeLabel} onClick={() => removeToast(toast.id)} />
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastViewport;
