import { IoCheckmarkCircle, IoCloseCircle, IoFlash, IoInformationCircle, IoWarning } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Callout.module.css';

interface CalloutProps {
  variant: 'info' | 'success' | 'warning' | 'danger' | 'tip';
  title?: string;
  icon?: JSX.Element;
  children: JSX.Element;
}

const defaultIcons: Record<CalloutProps['variant'], () => JSX.Element> = {
  info: () => <IoInformationCircle size={20} />,
  success: () => <IoCheckmarkCircle size={20} />,
  warning: () => <IoWarning size={20} />,
  danger: () => <IoCloseCircle size={20} />,
  tip: () => <IoFlash size={20} />,
};

const Callout = (props: Props<CalloutProps>) => {
  const icon = () => props.icon ?? defaultIcons[props.variant]();

  return (
    <div class={`${styles.callout} ${styles[props.variant]} ${props.class ?? ''}`}>
      <div class={styles.icon}>{icon()}</div>
      <div class={styles.content}>
        <Show when={props.title}>
          <div class={styles.title}>{props.title}</div>
        </Show>
        <div class={styles.body}>{props.children}</div>
      </div>
    </div>
  );
};

export default Callout;
