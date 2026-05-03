import { FiAlertCircle } from 'solid-icons/fi';
import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';

import FallbackState from '../FallbackState/FallbackState';

export interface NotFoundProps {
  onGoHome?: () => void;
  children?: never;
}

const NotFound = (props: Props<NotFoundProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'onGoHome']);

  const navigateHome = () => {
    if (local.onGoHome) {
      local.onGoHome();
      return;
    }

    if (typeof window === 'undefined') return;
    window.location.href = '/';
  };

  return (
    <FallbackState
      {...rest}
      class={local.class}
      label={ts('notFound.title')}
      description={ts('notFound.description')}
      icon={FiAlertCircle}
      action={<Button onClick={navigateHome} label={ts('notFound.goHome')} />}
    />
  );
};

export default NotFound;
