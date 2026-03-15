import { IoClose } from 'solid-icons/io';
import { For } from 'solid-js';

import type Props from '~/models/Props';

import IconButton from '../../inputs/IconButton/IconButton';
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
            <div class={styles.message}>{toast.message}</div>
            <IconButton
              icon={<IoClose />}
              title={props.closeLabel}
              class={styles.closeBtn}
              onClick={() => removeToast(toast.id)}
            />
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastViewport;
