import { type JSX, onCleanup } from 'solid-js';

import { cleanupToasts } from './Toast';
import ToastViewport from './ToastViewport';

interface ToastProviderMessages {
  closeButtonLabel?: string;
}

interface ToastProviderProps {
  children: JSX.Element;
  closeLabel?: string;
  messages?: ToastProviderMessages;
}

const ToastProvider = (props: ToastProviderProps) => {
  onCleanup(cleanupToasts);

  return (
    <>
      {props.children}
      <ToastViewport closeLabel={props.messages?.closeButtonLabel ?? props.closeLabel ?? 'Close'} />
    </>
  );
};

export default ToastProvider;
