import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DialogBody.module.css';

interface DialogBodyProps {
  children: JSX.Element;
}

const DialogBody = (props: Props<DialogBodyProps>) => {
  const [local, rest] = splitProps(props, ['children', 'class']);
  return (
    <div {...rest} class={classNames(styles.root, local.class)}>
      {local.children}
    </div>
  );
};

export default DialogBody;
