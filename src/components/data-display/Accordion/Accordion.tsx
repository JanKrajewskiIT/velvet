import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Accordion.module.css';

const Accordion = (props: Props<JSX.HTMLAttributes<HTMLDivElement>>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={`${styles.accordion} ${local.class ?? ''}`} {...rest}>
      {local.children}
    </div>
  );
};

export default Accordion;
