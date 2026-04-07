import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Surface, { type SurfaceRadius } from '../Surface/Surface';
import styles from './Card.module.css';

export interface CardOwnProps extends DivCoreNativeProps {
  as?: keyof JSX.IntrinsicElements;
  children?: JSX.Element;
  padding?: 'default' | 'none';
  hoverable?: boolean;
  radius?: SurfaceRadius;
  clip?: boolean;
}

const Card = (props: Props<CardOwnProps>) => {
  const [local, rest] = splitProps(props, ['as', 'children', 'padding', 'hoverable', 'radius', 'clip', 'class']);

  return (
    <Surface
      as={local.as ?? 'div'}
      radius={local.radius}
      clip={local.clip}
      class={classNames(
        styles.card,
        local.padding === 'none' ? styles.paddingNone : styles.paddingDefault,
        local.hoverable && styles.hoverable,
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </Surface>
  );
};

export default Card;
