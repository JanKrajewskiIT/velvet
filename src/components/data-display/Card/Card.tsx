import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Card.module.css';

interface CardOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

const Card = (props: Props<CardOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'class']);

  return (
    <div class={`${styles.card} ${local.class ?? ''}`} {...rest}>
      {local.children}
    </div>
  );
};

export default Card;
