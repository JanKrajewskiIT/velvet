import { IoChevronDown, IoChevronForward } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import AffixButton from '../../../buttons/AffixButton/AffixButton';
import IconButton from '../../../buttons/IconButton/IconButton';
import Badge from '../../../feedback/Badge/Badge';
import styles from './SidebarItemButton.module.css';

interface SidebarItemButtonOwnProps {
  label: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  badge?: string | number;
  hasChildren?: boolean;
  expanded?: boolean;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  style?: JSX.CSSProperties;
}

const SidebarItemButton = (props: Props<SidebarItemButtonOwnProps>) => {
  const iconTitle = () => props.label;
  const resolvedSuffix = () => (
    <>
      <Show when={props.badge !== undefined}>
        <Badge content={props.badge} class={styles.badgeCount}>
          <span class={styles.badgeAnchor} />
        </Badge>
      </Show>
      <Show when={props.hasChildren}>{props.expanded ? <IoChevronDown /> : <IoChevronForward />}</Show>
      {props.suffix}
    </>
  );

  return (
    <Show
      when={props.collapsed}
      fallback={
        <AffixButton
          variant={props.active ? 'primary' : 'ghost'}
          text={props.label}
          prefix={props.prefix}
          suffix={resolvedSuffix()}
          class={classNames(styles.itemButton, props.class)}
          bodyClass={styles.label}
          suffixClass={styles.expandIcon}
          style={props.style}
          onClick={() => props.onClick?.()}
        />
      }
    >
      <IconButton
        class={styles.itemIconButton}
        icon={props.prefix}
        variant={props.active ? 'primary' : 'ghost'}
        label={iconTitle()}
        onClick={() => props.onClick?.()}
        style={props.style}
      />
    </Show>
  );
};

export default SidebarItemButton;
