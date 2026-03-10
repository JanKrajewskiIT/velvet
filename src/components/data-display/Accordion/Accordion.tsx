import { type JSX, splitProps } from 'solid-js';

import styles from './Accordion.module.css';

export type AccordionProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Accordion = (props: AccordionProps) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={`${styles.accordion} ${local.class || ''}`} {...rest}>
      {local.children}
    </div>
  );
};
