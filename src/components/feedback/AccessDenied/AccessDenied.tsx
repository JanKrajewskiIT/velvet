import { IoLockClosedOutline } from 'solid-icons/io';
import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import type Props from '~/models/Props';

import FallbackState from '../FallbackState/FallbackState';

interface AccessDeniedProps {
  label: string;
  description: string;
  goHomeLabel: string;
  onGoHome?: () => void;
}

const AccessDenied = (props: Props<AccessDeniedProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'goHomeLabel', 'onGoHome']);

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
      label={local.label}
      description={local.description}
      icon={IoLockClosedOutline}
      action={<Button onClick={navigateHome} label={local.goHomeLabel} />}
    />
  );
};

export default AccessDenied;
