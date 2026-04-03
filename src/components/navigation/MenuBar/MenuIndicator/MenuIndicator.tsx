import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MenuIndicator.module.css';

interface MenuIndicatorProps {
  offset: number;
}

const MenuIndicator = (props: Props<MenuIndicatorProps>) => {
  return (
    <div
      class={classNames(styles.indicator, props.class)}
      style={{ '--indicator-offset': String(props.offset) }}
      aria-hidden="true"
    >
      <span class={styles.indicatorRing} />
    </div>
  );
};

export default MenuIndicator;
