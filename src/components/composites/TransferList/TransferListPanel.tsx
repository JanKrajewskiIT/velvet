import { For, Show } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import SearchInput from '~/components/inputs/SearchInput/SearchInput';
import Card from '~/components/surfaces/Card/Card';
import Heading from '~/components/typography/Heading/Heading';
import classNames from '~/utils/classNames';

import Checkbox from '../../switchers/Checkbox/Checkbox';
import type { TransferItem } from './TransferList';
import styles from './TransferListPanel.module.css';

interface TransferListPanelProps {
  title: string;
  items: readonly TransferItem[];
  filterValue: string;
  searchable?: boolean;
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
        <Heading level={5}>{props.title}</Heading>
        <Chip size="sm" variant="subtle" label={props.items.length.toString()} />
      </div>
      <Show when={props.searchable}>
        <div class={styles.search}>
          <SearchInput class={styles.searchInput} size="sm" value={props.filterValue} onInput={props.onFilterChange} />
        </div>
      </Show>
      <div class={styles.list}>
        <For each={props.items}>
          {(item, index) => (
            <div
              class={getItemClass(props.checkedIds.has(item.id))}
              style={{ '--transfer-item-index': String(index()) }}
            >
              <Checkbox
                class={styles.checkboxField}
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
