import { For } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import MenuIndicator from '../MenuIndicator/MenuIndicator';
import MenuItem from '../MenuItem/MenuItem';
import type { NavItem } from '../Navbar/NavItem';
import styles from './MenuBar.module.css';

interface MenuBarProps {
  items: NavItem[];
  activeIndex: number;
  navLabel?: string;
}

const MenuBar = (props: Props<MenuBarProps>) => {
  return (
    <nav class={classNames(styles.menuBar, props.class)} aria-label={props.navLabel}>
      <ul class={styles.menuList}>
        <For each={props.items}>
          {(item, index) => <MenuItem item={item} isActive={props.activeIndex === index()} />}
        </For>
        {props.items.length > 0 && <MenuIndicator offset={props.activeIndex} />}
      </ul>
    </nav>
  );
};

export default MenuBar;
