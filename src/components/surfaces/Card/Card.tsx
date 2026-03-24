import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Card.module.css';

interface CardOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  padding?: 'default' | 'none';
}

const Card = (props: Props<CardOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'padding', 'class']);

  return (
    <div
      class={classNames(
        styles.card,
        local.padding === 'none' ? styles.paddingNone : styles.paddingDefault,
        local.class
      )}
      {...rest}
    >
      {local.children}
    </div>
  );
};

export default Card;
