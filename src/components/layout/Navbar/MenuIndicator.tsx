import type Props from '~/models/Props';

import styles from './Navbar.module.css';

interface MenuIndicatorProps {
  offset: number;
}

const MenuIndicator = (props: Props<MenuIndicatorProps>) => {
  return (
    <div
      class={`${styles.indicator} ${props.class ?? ''}`}
      style={{
        transform: `translateX(calc(var(--header-height) * ${props.offset}))`,
      }}
      aria-hidden="true"
    >
      <span class={styles.indicatorRing} />
    </div>
  );
};

export default MenuIndicator;
