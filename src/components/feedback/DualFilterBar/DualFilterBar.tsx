import { For } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DualFilterBar.module.css';

export interface DualFilterBarOption {
  value: string;
  label: string;
}

interface DualFilterBarProps {
  filterItems: readonly DualFilterBarOption[];
  sortItems: readonly DualFilterBarOption[];
  activeFilter: string;
  activeSort: string;
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const DualFilterBar = (props: Props<DualFilterBarProps>) => {
  const { ts } = useI18n();

  return (
    <div class={classNames(styles.bar, props.class)} role="toolbar" aria-label={props['aria-label']}>
      <div class={styles.group} role="group" aria-label={ts('dualFilterBar.filterGroup')}>
        <For each={props.filterItems}>
          {(item) => (
            <Chip
              size="sm"
              variant="subtle"
              label={item.label}
              selected={props.activeFilter === item.value}
              onClick={() => props.onFilterChange(item.value)}
            />
          )}
        </For>
      </div>
      <div class={styles.separator} aria-hidden="true" />
      <div class={styles.group} role="group" aria-label={ts('dualFilterBar.sortGroup')}>
        <For each={props.sortItems}>
          {(item) => (
            <Chip
              size="sm"
              variant="subtle"
              label={item.label}
              selected={props.activeSort === item.value}
              onClick={() => props.onSortChange(item.value)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export type { DualFilterBarProps };
export default DualFilterBar;
