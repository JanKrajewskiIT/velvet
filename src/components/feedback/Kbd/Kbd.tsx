import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { HTMLElementCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Kbd.module.css';

const Kbd = (props: Props<HTMLElementCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <kbd {...rest} class={classNames(styles.kbd, local.class)}>
      {local.children}
    </kbd>
  );
};

export default Kbd;
