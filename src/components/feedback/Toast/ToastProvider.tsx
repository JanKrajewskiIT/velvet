import { type JSX, onCleanup } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
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
  const { t } = useI18n();
  onCleanup(cleanupToasts);

  return (
    <>
      {props.children}
      <ToastViewport
        class={props.class}
        closeLabel={props.messages?.closeButtonLabel ?? props.closeLabel ?? t('common.close')}
      />
    </>
  );
};

export default ToastProvider;
