import type { ParentProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Kbd.module.css';

const Kbd = (props: Props<ParentProps>) => {
  return <kbd class={`${styles.kbd} ${props.class ?? ''}`}>{props.children}</kbd>;
};

export default Kbd;
