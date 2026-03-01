import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './Dialog.module.css';

interface DialogTitleProps {
  children: JSX.Element;
}

const DialogTitle = (props: Props<DialogTitleProps>) => {
  return (
    <div class={`${styles.header} ${props.class ?? ''}`}>
      <h3 class={styles.title}>{props.children}</h3>
    </div>
  );
};

export default DialogTitle;
