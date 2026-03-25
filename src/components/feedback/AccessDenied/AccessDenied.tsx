import { IoLockClosedOutline } from 'solid-icons/io';

import Button from '~/components/buttons/Button/Button';
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
  const navigateHome = () => {
    if (props.onGoHome) {
      props.onGoHome();
      return;
    }

    if (typeof window === 'undefined') return;
    window.location.href = props.goHomeHref ?? '/';
  };

  return (
    <FallbackState
      class={props.class}
      label={props.label}
      description={props.description}
      icon={<IoLockClosedOutline class={styles.icon} aria-hidden />}
      action={<Button onClick={navigateHome} label={props.goHomeLabel} />}
    />
  );
};

export default AccessDenied;
