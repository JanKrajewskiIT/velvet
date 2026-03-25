import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Kbd.module.css';

type KbdProps = JSX.HTMLAttributes<HTMLElement>;

const Kbd = (props: Props<KbdProps>) => {
  return <kbd class={classNames(styles.kbd, props.class)}>{props.children}</kbd>;
};

export default Kbd;
