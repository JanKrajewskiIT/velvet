import type Props from '~/models/Props';
import type { HTMLElementCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Kbd.module.css';

const Kbd = (props: Props<HTMLElementCoreNativeProps>) => {
  return <kbd class={classNames(styles.kbd, props.class)}>{props.children}</kbd>;
};

export default Kbd;
