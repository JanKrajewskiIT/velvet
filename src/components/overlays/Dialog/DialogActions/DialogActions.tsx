import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DialogActions.module.css';

interface DialogActionsProps {
  children: JSX.Element;
}

const DialogActions = (props: Props<DialogActionsProps>) => {
  const [local, rest] = splitProps(props, ['children', 'class']);
  return (
    <div {...rest} class={classNames(styles.root, local.class)}>
      {local.children}
    </div>
  );
};

export default DialogActions;
