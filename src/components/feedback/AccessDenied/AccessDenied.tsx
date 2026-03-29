import { IoLockClosedOutline } from 'solid-icons/io';
import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Icon from '~/components/media/Icon/Icon';
import type Props from '~/models/Props';

import FallbackState from '../FallbackState/FallbackState';
import styles from './AccessDenied.module.css';

interface AccessDeniedProps {
  label: string;
  description: string;
  goHomeLabel: string;
  goHomeHref?: string;
  onGoHome?: () => void;
}

const AccessDenied = (props: Props<AccessDeniedProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'goHomeLabel', 'goHomeHref', 'onGoHome']);

  const navigateHome = () => {
    if (local.onGoHome) {
      local.onGoHome();
      return;
    }

    if (typeof window === 'undefined') return;
    window.location.href = local.goHomeHref ?? '/';
  };

  return (
    <FallbackState
      {...rest}
      class={local.class}
      label={local.label}
      description={local.description}
      icon={<Icon icon={IoLockClosedOutline} class={styles.icon} />}
      action={<Button onClick={navigateHome} label={local.goHomeLabel} />}
    />
  );
};

export default AccessDenied;
