import { type JSX, onCleanup } from 'solid-js';

import type Props from '~/models/Props';

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

const ToastProvider = (props: Props<ToastProviderProps>) => {
  onCleanup(cleanupToasts);

  return (
    <>
      {props.children}
      <ToastViewport class={props.class} closeLabel={props.messages?.closeButtonLabel ?? props.closeLabel ?? 'Close'} />
    </>
  );
};

export default ToastProvider;
