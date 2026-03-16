import { IoLockClosedOutline } from 'solid-icons/io';

import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import FallbackState from '../FallbackState/FallbackState';
import styles from './AccessDenied.module.css';

interface AccessDeniedProps {
  title: string;
  description: string;
  goHomeLabel: string;
  goHomeHref?: string;
}

const AccessDenied = (props: Props<AccessDeniedProps>) => {
  const navigateHome = () => {
    if (typeof window === 'undefined') return;
    window.location.href = props.goHomeHref ?? '/';
  };

  return (
    <FallbackState
      class={props.class}
      title={props.title}
      description={props.description}
      icon={<IoLockClosedOutline class={styles.icon} aria-hidden />}
      action={<Button onClick={navigateHome}>{props.goHomeLabel}</Button>}
    />
  );
};

export default AccessDenied;
