import { For } from 'solid-js';

import type Props from '~/models/Props';

import { removeToast, toasts } from './Toast';
import styles from './Toast.module.css';

interface ToastViewportBaseProps {
  closeLabel: string;
}

const ToastViewport = (props: Props<ToastViewportBaseProps>) => {
  return (
    <div
      class={`${styles.toastContainer} ${props.class ?? ''}`}
      role="region"
      aria-live="polite"
      aria-atomic="false"
    >
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`${styles.toast} ${styles[toast.type]}`}
            role={toast.type === 'error' ? 'alert' : 'status'}
          >
            <div class={styles.message}>{toast.message}</div>
            <button
              type="button"
              class={styles.closeBtn}
              onClick={() => removeToast(toast.id)}
              aria-label={props.closeLabel}
            >
              &times;
            </button>
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastViewport;
