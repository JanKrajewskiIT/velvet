import { For } from 'solid-js';

import type Props from '~/models/Props';

import MenuIndicator from './MenuIndicator';
import MenuItem from './MenuItem';
import styles from './Navbar.module.css';
import type { NavItem } from './NavItem';

interface MenuBarProps {
  items: NavItem[];
  activeIndex: number;
  navLabel?: string;
}

const MenuBar = (props: Props<MenuBarProps>) => {
  return (
    <nav
      class={`${styles.menuBar} ${props.class ?? ''}`}
      aria-label={props.navLabel}
    >
      <ul class={styles.menuList}>
        <For each={props.items}>
          {(item, index) => (
            <MenuItem item={item} isActive={props.activeIndex === index()} />
          )}
        </For>
        <MenuIndicator offset={props.activeIndex} />
      </ul>
    </nav>
  );
};

export default MenuBar;
