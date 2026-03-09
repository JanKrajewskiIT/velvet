import { type JSX, onMount } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './Dialog.module.css';

interface DialogTitleProps {
  children: JSX.Element;
}

const DialogTitle = (props: Props<DialogTitleProps>) => {
  let headerRef: HTMLDivElement | undefined;

  onMount(() => {
    const dialog = headerRef?.closest('dialog');
    const titleId = dialog?.dataset.dialogTitleId;
    if (titleId && headerRef) {
      const heading = headerRef.querySelector('h3');
      if (heading) heading.id = titleId;
    }
  });

  return (
    <div ref={headerRef} class={`${styles.header} ${props.class ?? ''}`}>
      <h3 class={styles.title}>{props.children}</h3>
    </div>
  );
};

export default DialogTitle;
