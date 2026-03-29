import { type JSX, onCleanup, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import { cleanupToasts } from '../Toast';
import ToastViewport from '../ToastViewport/ToastViewport';

interface ToastProviderProps {
  children: JSX.Element;
}

const ToastProvider = (props: Props<ToastProviderProps>) => {
  const [local] = splitProps(props, ['class', 'children']);

  onCleanup(cleanupToasts);

  return (
    <>
      {local.children}
      <ToastViewport class={local.class} />
    </>
  );
};

export default ToastProvider;
