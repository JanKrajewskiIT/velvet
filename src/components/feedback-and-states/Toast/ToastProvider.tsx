import { type JSX, onCleanup } from 'solid-js';

import { cleanupToasts } from './Toast';
import { ToastViewport } from './ToastViewport';

interface ToastProviderProps {
  children: JSX.Element;
  closeLabel: string;
}

export const ToastProvider = (props: ToastProviderProps) => {
  onCleanup(cleanupToasts);

  return (
    <>
      {props.children}
      <ToastViewport closeLabel={props.closeLabel} />
    </>
  );
};
