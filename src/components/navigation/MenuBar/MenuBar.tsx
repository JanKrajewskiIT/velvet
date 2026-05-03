import { For } from 'solid-js';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { NavItem } from '../Navbar/NavItem';
import styles from './MenuBar.module.css';
import MenuIndicator from './MenuIndicator/MenuIndicator';
import MenuItem from './MenuItem/MenuItem';

interface MenuBarProps {
  items: NavItem[];
  activeIndex: number;
}

const MenuBar = (props: Props<MenuBarProps>) => {
  const { ts } = useI18n();

  return (
    <nav class={classNames(styles.menuBar, props.class)} aria-label={ts('navbar.navigation')}>
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
