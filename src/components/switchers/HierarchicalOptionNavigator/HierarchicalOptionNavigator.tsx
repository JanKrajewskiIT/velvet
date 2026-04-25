import type { JSX } from 'solid-js';
import { createMemo, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ChipOptionSwitcher from '../ChipOptionSwitcher/ChipOptionSwitcher';
import IconOptionSwitcher from '../IconOptionSwitcher/IconOptionSwitcher';
import styles from './HierarchicalOptionNavigator.module.css';

export interface HierarchicalOptionChildItem {
  id: string;
  label: string;
}

export interface HierarchicalOptionItem {
  id: string;
  label: string;
  icon: JSX.Element;
  children?: readonly HierarchicalOptionChildItem[];
}

interface HierarchicalOptionNavigatorProps {
  items: readonly HierarchicalOptionItem[];
  selectedMainId?: string | null;
  selectedChildId?: string | null;
  align?: 'left' | 'center' | 'right';
  onMainSelect: (id: string) => void;
  onChildSelect?: (id: string) => void;
}

const HierarchicalOptionNavigator = (props: Props<HierarchicalOptionNavigatorProps>) => {
  const { ts } = useI18n();
  const alignClass = createMemo(() => {
    if (props.align === 'center') return styles.alignCenter;
    if (props.align === 'right') return styles.alignRight;
    return styles.alignLeft;
  });

  const mainItems = createMemo(() =>
    props.items.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
    })),
  );

  const childItems = createMemo(() => {
    const selectedChildren = props.items.find((item) => item.id === props.selectedMainId)?.children ?? [];

    return selectedChildren.map((item) => ({
      id: item.id,
      label: item.label,
    }));
  });

  return (
    <div class={classNames(styles.navigator, alignClass(), props.class)}>
      <IconOptionSwitcher
        aria-label={ts('sidebar.componentCategories')}
        items={mainItems()}
        selectedId={props.selectedMainId}
        onSelect={props.onMainSelect}
      />

      <Show when={childItems().length > 0 && props.onChildSelect}>
        <ChipOptionSwitcher
          class={styles.children}
          aria-label={ts('sidebar.componentCategories')}
          items={childItems()}
          selectedId={props.selectedChildId}
          onSelect={(id) => props.onChildSelect?.(id)}
        />
      </Show>
    </div>
  );
};

export type { HierarchicalOptionNavigatorProps };
export default HierarchicalOptionNavigator;
