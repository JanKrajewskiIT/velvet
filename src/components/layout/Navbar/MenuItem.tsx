import { A } from '@solidjs/router';

import type Props from '../../../models/Props';

import styles from './Navbar.module.css';
import type { NavItem } from './NavItem';

interface MenuItemProps {
  item: NavItem;
  isActive: boolean;
}

const MenuItem = (props: Props<MenuItemProps>) => {
  return (
    <li
      class={`${styles.menuItem} ${props.isActive ? styles.active : ''} ${props.class ?? ''}`}
    >
      <A
        href={props.item.href}
        aria-label={props.item.label}
        class={styles.menuItemLink}
      >
        <props.item.icon class={styles.menuIcon} />
      </A>
      <span class={styles.tooltip}>{props.item.label}</span>
    </li>
  );
};

export default MenuItem;
