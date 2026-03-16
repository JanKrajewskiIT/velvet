import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import AffixButton from '../../buttons/AffixButton/AffixButton';
import IconButton from '../../buttons/IconButton/IconButton';
import styles from './Sidebar.module.css';

interface SidebarItemButtonOwnProps {
  label: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  badge?: string | number;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  style?: JSX.CSSProperties;
}

const SidebarItemButton = (props: Props<SidebarItemButtonOwnProps>) => {
  const iconTitle = () => props.label;

  return (
    <Show
      when={props.collapsed}
      fallback={
        <AffixButton
          variant={props.active ? 'primary' : 'ghost'}
          prefix={props.prefix}
          suffix={props.suffix}
          badge={props.badge}
          class={classNames(styles.itemButton, props.active && styles.active, props.class)}
          contentClass={styles.itemContent}
          prefixClass={styles.icon}
          bodyClass={styles.label}
          suffixClass={styles.expandIcon}
          badgeClass={styles.badge}
          style={props.style}
          onClick={() => props.onClick?.()}
        >
          {props.label}
        </AffixButton>
      }
    >
      <IconButton
        icon={props.prefix ?? <span class={styles.fallbackIcon}>•</span>}
        title={iconTitle()}
        class={classNames(styles.itemIconButton, props.active && styles.itemIconButtonActive, props.class)}
        onClick={() => props.onClick?.()}
        style={props.style}
      />
    </Show>
  );
};

export default SidebarItemButton;
