import { type JSX, onCleanup } from 'solid-js';

import { cleanupToasts } from './Toast';
import ToastViewport from './ToastViewport';

interface ToastProviderProps {
  children: JSX.Element;
  closeLabel: string;
}

const ToastProvider = (props: ToastProviderProps) => {
  onCleanup(cleanupToasts);

  return (
    <>
      {props.children}
      <ToastViewport closeLabel={props.closeLabel} />
    </>
  );
};

export default ToastProvider;
