import { createSignal } from 'solid-js';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ToastNotification extends ToastMessage {
  createdAt: number;
  read: boolean;
}

export const [toasts, setToasts] = createSignal<ToastMessage[]>([]);
export const [notifications, setNotifications] = createSignal<ToastNotification[]>([]);
let fallbackToastId = 0;
export const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

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
  const toastMessage = { ...toast, id };
  setToasts((prev) => [...prev, toastMessage]);
  setNotifications((prev) => [{ ...toastMessage, createdAt: Date.now(), read: false }, ...prev]);

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

export const markNotificationRead = (id: string): void => {
  setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
};

export const markAllNotificationsRead = (): void => {
  setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
};

export const removeNotification = (id: string): void => {
  setNotifications((prev) => prev.filter((item) => item.id !== id));
};

export const clearNotifications = (): void => {
  setNotifications([]);
};

export const useToastNotifications = () => {
  return {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
  };
};

export const cleanupToasts = (): void => {
  for (const timer of toastTimers.values()) {
    clearTimeout(timer);
  }
  toastTimers.clear();
  setToasts([]);
  setNotifications([]);
};
