import { For, Show } from 'solid-js';

import SearchInput from '~/components/inputs/SearchInput/SearchInput';
import Card from '~/components/surfaces/Card/Card';
import Text from '~/components/typography/Text/Text';
import classNames from '~/utils/classNames';

import Checkbox from '../../switchers/Checkbox/Checkbox';
import type { TransferItem } from './TransferList';
import styles from './TransferList.module.css';

interface TransferListPanelProps {
  title: string;
  items: readonly TransferItem[];
  itemCount: number;
  filterValue: string;
  searchable?: boolean;
  clearSearchLabel: string;
  searchInputLabel: string;
  selectItemLabel: (label: string) => string;
  checkedIds: ReadonlySet<string>;
  onFilterChange: (value: string) => void;
  onToggleItem: (id: string) => void;
}

const TransferListPanel = (props: TransferListPanelProps) => {
  const getItemClass = (checked: boolean) => classNames(styles.item, checked && styles.itemChecked);

  return (
    <Card padding="none" class={styles.panel}>
      <div class={styles.header}>
        <Text as="span" variant="labelMd">
          {props.title}
        </Text>
        <Text as="span" variant="caption" tone="muted">
          {props.itemCount}
        </Text>
      </div>
      <Show when={props.searchable}>
        <div class={styles.search}>
          <SearchInput
            class={styles.searchInput}
            size="sm"
            value={props.filterValue}
            onInput={props.onFilterChange}
            clearLabel={props.clearSearchLabel}
            inputAriaLabel={props.searchInputLabel}
          />
        </div>
      </Show>
      <div class={styles.list}>
        <For each={props.items}>
          {(item) => (
            <div class={getItemClass(props.checkedIds.has(item.id))}>
              <Checkbox
                wrapperClass={styles.checkboxField}
                checked={props.checkedIds.has(item.id)}
                onChange={() => props.onToggleItem(item.id)}
                label={item.label}
                aria-label={props.selectItemLabel(item.label)}
              />
            </div>
          )}
        </For>
      </div>
    </Card>
  );
};

export default TransferListPanel;
