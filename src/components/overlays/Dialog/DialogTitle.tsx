import { type JSX, onMount } from 'solid-js';

import type Props from '~/models/Props';

import Heading from '../../typography/Heading/Heading';
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
      <Heading variant="titleLg" as="h3" class={styles.title}>
        {props.children}
      </Heading>
    </div>
  );
};

export default DialogTitle;
