import type { JSX } from 'solid-js';
import { For } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './IconCategorySelector.module.css';

export interface IconCategorySelectorItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

interface IconCategorySelectorProps {
  items: readonly IconCategorySelectorItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const IconCategorySelector = (props: Props<IconCategorySelectorProps>) => {
  return (
    <div class={classNames(styles.selector, props.class)} role="tablist" aria-label={props['aria-label']}>
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

export type { IconCategorySelectorProps };
export default IconCategorySelector;
