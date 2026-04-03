import { For } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ChipOptionSwitcher.module.css';

export interface ChipOptionSwitcherItem {
  id: string;
  label: string;
}

interface ChipOptionSwitcherProps {
  items: readonly ChipOptionSwitcherItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const ChipOptionSwitcher = (props: Props<ChipOptionSwitcherProps>) => {
  return (
    <div class={classNames(styles.selector, props.class)}>
      <For each={props.items}>
        {(item) => (
          <Chip
            label={item.label}
            variant="primary"
            selected={props.selectedId === item.id}
            onClick={() => props.onSelect(item.id)}
          />
        )}
      </For>
    </div>
  );
};

export type { ChipOptionSwitcherProps };
export default ChipOptionSwitcher;
