import { A } from '@solidjs/router';
import { splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import Tooltip from '~/components/overlays/Tooltip/Tooltip';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { NavItem } from '../../Navbar/NavItem';
import styles from './MenuItem.module.css';

interface MenuItemProps {
  item: NavItem;
  isActive: boolean;
}

const MenuItem = (props: Props<MenuItemProps>) => {
  const [local, rest] = splitProps(props, ['item', 'isActive', 'class']);
  return (
    <li {...rest} class={classNames(styles.menuItem, local.isActive && styles.active, local.class)}>
      <Tooltip position="bottom" content={local.item.label} class={styles.menuItemTooltip}>
        <A
          href={local.item.href}
          aria-label={local.item.label}
          aria-current={local.isActive ? 'page' : undefined}
          class={styles.menuItemLink}
        >
          <Icon icon={local.item.icon} class={styles.menuIcon} />
        </A>
      </Tooltip>
    </li>
  );
};

export default MenuItem;
