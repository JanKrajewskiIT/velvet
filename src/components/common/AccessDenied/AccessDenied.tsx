import { A } from '@solidjs/router';
import { IoLockClosedOutline } from 'solid-icons/io';

import type Props from '../../../models/Props';

import styles from './AccessDenied.module.css';

interface AccessDeniedProps {
  title: string;
  description: string;
  goHomeLabel: string;
  goHomeHref?: string;
}

const AccessDenied = (props: Props<AccessDeniedProps>) => {
  return (
    <div class={`${styles.container} ${props.class ?? ''}`}>
      <div class={styles.content}>
        <IoLockClosedOutline class={styles.icon} aria-hidden />
        <h1 class={styles.title}>{props.title}</h1>
        <p class={styles.description}>{props.description}</p>
        <A href={props.goHomeHref ?? '/'} class={styles.link}>
          {props.goHomeLabel}
        </A>
      </div>
    </div>
  );
};

export default AccessDenied;
