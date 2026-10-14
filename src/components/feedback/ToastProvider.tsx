import { createContext, createEffect, createSignal, For, type JSX, mergeProps, splitProps, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Toast, type ToastProps } from './Toast';
import { ToastRegion } from './ToastRegion';

export interface ToastOptions extends ToastProps {
  /** Re-using an id replaces that toast in place. Generated when omitted. */
  id?: string;
}

export interface ToastController {
  /** Queues a toast and returns its id. Beyond `max` visible toasts the oldest is dropped. */
  show: (options: ToastOptions) => string;
  /** Removes a toast and calls its `onClose`. No-op for an unknown id. */
  dismiss: (id: string) => void;
  /** Dismisses every toast. */
  clear: () => void;
}

export interface ToastProviderProps {
  /** Most toasts shown at once. @default 5 */
  max?: number;
  /** Auto-dismiss time (ms) for toasts that set no `duration`; 0 keeps them until dismissed. @default 5000 */
  defaultDuration?: number;
  /** Class of the region that holds the toasts. */
  regionClass?: string;
  children?: JSX.Element;
}

interface ToastEntry {
  id: string;
  options: ToastOptions;
}

const ToastContext = createContext<ToastController>();

/** Owns the toast queue and renders it in a `ToastRegion` portal. */
export const ToastProvider = (props: ToastProviderProps) => {
  const p = mergeProps({ max: 5, defaultDuration: 5000 } satisfies Partial<ToastProviderProps>, props);
  const [entries, setEntries] = createSignal<ToastEntry[]>([]);
  let sequence = 0;
  const max = () => (Number.isFinite(p.max) && p.max >= 0 ? Math.min(100, Math.floor(p.max)) : 5);
  const trim = (list: ToastEntry[]) => {
    const keep = max();
    const evicted = list.slice(0, Math.max(0, list.length - keep));
    setEntries(keep ? list.slice(-keep) : []);
    evicted.forEach((entry) => entry.options.onClose?.());
  };
  createEffect(() => {
    const limit = max();
    if (entries().length > limit) trim(entries());
  });

  const dismiss = (id: string) => {
    const entry = entries().find((e) => e.id === id);
    if (!entry) return;
    setEntries((list) => list.filter((e) => e.id !== id));
    entry.options.onClose?.();
  };
  const show = (options: ToastOptions) => {
    sequence += 1;
    const id = options.id ?? `toast-${sequence}`;
    const entry: ToastEntry = { id, options };
    const list = entries();
    trim(list.some((e) => e.id === id) ? list.map((e) => (e.id === id ? entry : e)) : [...list, entry]);
    return id;
  };
  const clear = () => entries().forEach((entry) => dismiss(entry.id));

  return (
    <ToastContext.Provider value={{ show, dismiss, clear }}>
      {props.children}
      <Portal>
        <ToastRegion class={p.regionClass}>
          <For each={entries()}>
            {(entry) => {
              const [local, rest] = splitProps(entry.options, ['id', 'onClose', 'duration']);
              return (
                <Toast {...rest} duration={local.duration ?? p.defaultDuration} onClose={() => dismiss(entry.id)} />
              );
            }}
          </For>
        </ToastRegion>
      </Portal>
    </ToastContext.Provider>
  );
};

/** The nearest `ToastProvider`'s controller. Throws when used outside one. */
export const useToast = (): ToastController => {
  const controller = useContext(ToastContext);
  if (!controller) throw new Error('useToast must be used inside a <ToastProvider>.');
  return controller;
};
