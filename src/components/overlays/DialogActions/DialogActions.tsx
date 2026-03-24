import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DialogActions.module.css';

interface DialogActionsProps {
  children: JSX.Element;
}

const DialogActions = (props: Props<DialogActionsProps>) => {
  return (
    <div class={classNames(styles.root, props.class)}>
      <div class={styles.actions}>{props.children}</div>
    </div>
  );
};

export default DialogActions;
