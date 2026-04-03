import type { JSX } from 'solid-js';
import { For } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './IconOptionSwitcher.module.css';

export interface IconOptionSwitcherItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

interface IconOptionSwitcherProps {
  items: readonly IconOptionSwitcherItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const IconOptionSwitcher = (props: Props<IconOptionSwitcherProps>) => {
  return (
    <div class={classNames(styles.selector, props.class)} role="group" aria-label={props['aria-label']}>
      <For each={props.items}>
        {(item) => (
          <IconButton
            class={classNames(styles.button, props.selectedId === item.id && styles.buttonSelected)}
            icon={item.icon}
            label={item.label}
            variant={props.selectedId === item.id ? 'primary' : 'subtle'}
            onClick={() => props.onSelect(item.id)}
            aria-pressed={props.selectedId === item.id}
          />
        )}
      </For>
    </div>
  );
};

export type { IconOptionSwitcherProps };
export default IconOptionSwitcher;
