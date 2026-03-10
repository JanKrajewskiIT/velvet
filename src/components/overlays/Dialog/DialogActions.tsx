import type { JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Dialog.module.css';

interface DialogActionsProps {
  children: JSX.Element;
}

const DialogActions = (props: Props<DialogActionsProps>) => {
  return (
    <div class={`${styles.footer} ${props.class ?? ''}`}>
      <div class={styles.actions}>{props.children}</div>
    </div>
  );
};

export default DialogActions;
