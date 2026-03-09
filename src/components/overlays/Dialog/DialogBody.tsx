import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './Dialog.module.css';

interface DialogBodyProps {
  children: JSX.Element;
}

const DialogBody = (props: Props<DialogBodyProps>) => {
  return (
    <div class={`${styles.body} ${props.class ?? ''}`}>{props.children}</div>
  );
};

export default DialogBody;
