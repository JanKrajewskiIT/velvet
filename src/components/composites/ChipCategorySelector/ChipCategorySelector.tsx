import { For } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ChipCategorySelector.module.css';

export interface ChipCategorySelectorItem {
  id: string;
  label: string;
}

interface ChipCategorySelectorProps {
  items: readonly ChipCategorySelectorItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const ChipCategorySelector = (props: Props<ChipCategorySelectorProps>) => {
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

export type { ChipCategorySelectorProps };
export default ChipCategorySelector;
