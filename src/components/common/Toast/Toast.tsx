import { createSignal, createUniqueId, For, JSX } from 'solid-js';

import styles from './Toast.module.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

const [toasts, setToasts] = createSignal<ToastMessage[]>([]);

export const addToast = (toast: Omit<ToastMessage, 'id'>) => {
  const id = createUniqueId();
  setToasts((prev) => [...prev, { ...toast, id }]);

  const duration = toast.duration !== undefined ? toast.duration : 3000;
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
};

export const removeToast = (id: string) => {
  setToasts((prev) => prev.filter((t) => t.id !== id));
};

export const useToast = () => {
  return { addToast, removeToast };
};

export const ToastProvider = (props: { children: JSX.Element }) => {
  return (
    <>
      {props.children}
      <div class={styles.toastContainer}>
        <For each={toasts()}>
          {(toast) => (
            <div class={`${styles.toast} ${styles[toast.type]}`}>
              <div class={styles.message}>{toast.message}</div>
              <button
                class={styles.closeBtn}
                onClick={() => removeToast(toast.id)}
              >
                &times;
              </button>
            </div>
          )}
        </For>
      </div>
    </>
  );
};
