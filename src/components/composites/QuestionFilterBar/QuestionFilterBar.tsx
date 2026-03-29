import { For } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './QuestionFilterBar.module.css';

export interface QuestionFilterBarOption {
  value: string;
  label: string;
}

interface QuestionFilterBarProps {
  filterItems: readonly QuestionFilterBarOption[];
  sortItems: readonly QuestionFilterBarOption[];
  activeFilter: string;
  activeSort: string;
  filterGroupLabel?: string;
  sortGroupLabel?: string;
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const QuestionFilterBar = (props: Props<QuestionFilterBarProps>) => {
  return (
    <div class={classNames(styles.bar, props.class)} role="toolbar" aria-label={props['aria-label']}>
      <div class={styles.group} role="group" aria-label={props.filterGroupLabel}>
        <For each={props.filterItems}>
          {(item) => (
            <Chip
              size="sm"
              variant="primaryOutline"
              label={item.label}
              selected={props.activeFilter === item.value}
              onClick={() => props.onFilterChange(item.value)}
            />
          )}
        </For>
      </div>
      <div class={styles.separator} aria-hidden="true" />
      <div class={styles.group} role="group" aria-label={props.sortGroupLabel}>
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

export type { QuestionFilterBarProps };
export default QuestionFilterBar;
