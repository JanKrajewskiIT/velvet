import type { JSX } from 'solid-js';
import { createMemo, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ChipCategorySelector from '../ChipCategorySelector/ChipCategorySelector';
import IconCategorySelector from '../IconCategorySelector/IconCategorySelector';
import styles from './HierarchicalCategoryNavigator.module.css';

export interface HierarchicalCategoryChildItem {
  id: string;
  label: string;
}

export interface HierarchicalCategoryItem {
  id: string;
  label: string;
  icon: JSX.Element;
  children?: readonly HierarchicalCategoryChildItem[];
}

interface HierarchicalCategoryNavigatorProps {
  items: readonly HierarchicalCategoryItem[];
  selectedMainId?: string | null;
  selectedChildId?: string | null;
  mainAriaLabel?: string;
  childAriaLabel?: string;
  onMainSelect: (id: string) => void;
  onChildSelect?: (id: string) => void;
}

const HierarchicalCategoryNavigator = (props: Props<HierarchicalCategoryNavigatorProps>) => {
  const mainItems = createMemo(() =>
    props.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
    }))
  );
  const childItems = createMemo(() => {
    const selectedChildren = props.items.find((item) => item.id === props.selectedMainId)?.children ?? [];

    return selectedChildren.map((item) => ({
      id: item.id,
      label: item.label,
    }));
  });

  return (
    <div class={classNames(styles.navigator, props.class)}>
      <IconCategorySelector
        aria-label={props.mainAriaLabel}
        items={mainItems()}
        selectedId={props.selectedMainId}
        onSelect={props.onMainSelect}
      />

      <Show when={childItems().length > 0 && props.onChildSelect}>
        <div class={styles.children}>
          <ChipCategorySelector
            aria-label={props.childAriaLabel}
            items={childItems()}
            selectedId={props.selectedChildId}
            onSelect={(id) => props.onChildSelect?.(id)}
          />
        </div>
      </Show>
    </div>
  );
};

export type { HierarchicalCategoryNavigatorProps };
export default HierarchicalCategoryNavigator;
