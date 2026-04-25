import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MenuIndicator.module.css';

interface MenuIndicatorProps {
  offset: number;
}

const MenuIndicator = (props: Props<MenuIndicatorProps>) => {
  const [local, rest] = splitProps(props, ['offset', 'class', 'style']);
  return (
    <div
      {...rest}
      class={classNames(styles.indicator, local.class)}
      style={{ '--indicator-offset': String(local.offset), ...local.style }}
      aria-hidden="true"
    >
      <span class={styles.indicatorRing} />
    </div>
  );
};

export default MenuIndicator;
