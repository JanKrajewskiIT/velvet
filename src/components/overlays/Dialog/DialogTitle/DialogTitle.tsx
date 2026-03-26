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

  return (
    <div class={classNames(styles.root, props.class)}>
      <Heading id={dialog?.titleId} variant="titleLg" as="h3">
        {props.label}
      </Heading>
    </div>
  );
};

export default DialogTitle;
