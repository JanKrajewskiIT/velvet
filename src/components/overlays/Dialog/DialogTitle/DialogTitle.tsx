import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Heading from '../../../typography/Heading/Heading';
import { useDialogContext } from '../DialogContext';
import styles from './DialogTitle.module.css';

interface DialogTitleProps {
  label: string;
  children?: never;
}

const DialogTitle = (props: Props<DialogTitleProps>) => {
  const dialog = useDialogContext();
  const [local, rest] = splitProps(props, ['label', 'class']);

  return (
    <div {...rest} class={classNames(styles.root, local.class)}>
      <Heading id={dialog?.titleId} variant="titleLg" as="h3">
        {local.label}
      </Heading>
    </div>
  );
};

export default DialogTitle;
