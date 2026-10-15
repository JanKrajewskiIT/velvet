import { type JSX, Show } from 'solid-js';

import { Kbd } from '../primitives/Kbd';
import { Text } from '../primitives/Text';
import styles from './MenuItemContent.module.css';

export interface MenuItemContentProps {
  leading?: JSX.Element;
  label: JSX.Element;
  description?: JSX.Element;
  shortcut?: JSX.Element;
  trailing?: JSX.Element;
}

export const MenuItemContent = (props: MenuItemContentProps) => (
  <>
    {props.leading}
    <Text as="span" variant="body" tone="inherit" class={styles.menuPartLabel}>
      {props.label}
      <Show when={props.description}>
        <Text as="span" variant="caption" tone="inherit" class={styles.menuPartDesc}>
          {props.description}
        </Text>
      </Show>
    </Text>
    <Show when={props.shortcut}>
      <Kbd plain class={styles.menuPartKbd}>
        {props.shortcut}
      </Kbd>
    </Show>
    {props.trailing}
  </>
);
