import { createSignal, For, type JSX, onCleanup } from 'solid-js';

import styles from './Toast.module.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastProviderProps {
  children: JSX.Element;
  closeLabel?: string;
}

interface ToastViewportProps {
  closeLabel?: string;
}

const [toasts, setToasts] = createSignal<ToastMessage[]>([]);
let fallbackToastId = 0;
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

const createToastId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  fallbackToastId += 1;
  return `toast-${fallbackToastId}`;
};

const clearToastTimer = (id: string): void => {
  const timer = toastTimers.get(id);
  if (!timer) return;
  clearTimeout(timer);
  toastTimers.delete(id);
};

export const addToast = (toast: Omit<ToastMessage, 'id'>): string => {
  const id = createToastId();
  setToasts((prev) => [...prev, { ...toast, id }]);

  const duration = toast.duration !== undefined ? toast.duration : 3000;
  if (duration > 0) {
    const timer = setTimeout(() => removeToast(id), duration);
    toastTimers.set(id, timer);
  }

  return id;
};

export const removeToast = (id: string): void => {
  clearToastTimer(id);
  setToasts((prev) => prev.filter((toast) => toast.id !== id));
};

export const useToast = () => {
  return { addToast, removeToast };
};

export const ToastViewport = (props: ToastViewportProps) => {
  return (
    <div
      class={styles.toastContainer}
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
              aria-label={props.closeLabel ?? 'Close toast'}
            >
              &times;
            </button>
          </div>
        )}
      </For>
    </div>
  );
};

export const ToastProvider = (props: ToastProviderProps) => {
  onCleanup(() => {
    for (const timer of toastTimers.values()) {
      clearTimeout(timer);
    }
    toastTimers.clear();
    setToasts([]);
  });

  return (
    <>
      {props.children}
      <ToastViewport closeLabel={props.closeLabel} />
    </>
  );
};
