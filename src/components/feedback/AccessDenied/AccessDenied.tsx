import { IoLockClosedOutline } from 'solid-icons/io';

import type Props from '~/models/Props';

import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
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
        <Heading level={1}>{props.title}</Heading>
        <Text tone="muted">{props.description}</Text>
        <a href={props.goHomeHref ?? '/'} class={styles.link}>
          {props.goHomeLabel}
        </a>
      </div>
    </div>
  );
};

export default AccessDenied;
