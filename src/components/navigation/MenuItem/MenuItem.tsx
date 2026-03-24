import { A } from '@solidjs/router';

import Tooltip from '~/components/overlays/Tooltip/Tooltip';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { NavItem } from '../Navbar/NavItem';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  item: NavItem;
  isActive: boolean;
}

const MenuItem = (props: Props<MenuItemProps>) => {
  return (
    <li class={classNames(styles.menuItem, props.isActive && styles.active, props.class)}>
      <Tooltip position="bottom" content={props.item.label} class={styles.menuItemTooltip}>
        <A href={props.item.href} aria-label={props.item.label} class={styles.menuItemLink}>
          <props.item.icon class={styles.menuIcon} />
        </A>
      </Tooltip>
    </li>
  );
};

export default MenuItem;
