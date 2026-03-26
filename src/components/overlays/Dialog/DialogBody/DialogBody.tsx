import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DialogBody.module.css';

interface DialogBodyProps {
  children: JSX.Element;
}

const DialogBody = (props: Props<DialogBodyProps>) => {
  return <div class={classNames(styles.root, props.class)}>{props.children}</div>;
};

export default DialogBody;
