import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Heading from '../../typography/Heading/Heading';
import { useDialogContext } from '../Dialog/DialogContext';
import styles from './DialogTitle.module.css';

interface DialogTitleProps {
  children: JSX.Element;
}

const DialogTitle = (props: Props<DialogTitleProps>) => {
  const dialog = useDialogContext();

  return (
    <div class={classNames(styles.root, props.class)}>
      <Heading id={dialog?.titleId} variant="titleLg" as="h3">
        {props.children}
      </Heading>
    </div>
  );
};

export default DialogTitle;
