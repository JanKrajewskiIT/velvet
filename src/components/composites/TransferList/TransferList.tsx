import { IoChevronBack, IoChevronForward, IoPlayBack, IoPlayForward } from 'solid-icons/io';
import { createMemo, createSignal, For, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import SearchInput from '~/components/inputs/SearchInput/SearchInput';
import Card from '~/components/surfaces/Card/Card';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Checkbox from '../../switchers/Checkbox/Checkbox';
import styles from './TransferList.module.css';

export interface TransferItem {
  id: string;
  label: string;
}

interface TransferListProps {
  sourceItems: TransferItem[];
  targetItems: TransferItem[];
  onChange: (source: TransferItem[], target: TransferItem[]) => void;
  sourceTitle?: string;
  targetTitle?: string;
  searchable?: boolean;
}

const TransferList = (props: Props<TransferListProps>) => {
  const [sourceChecked, setSourceChecked] = createSignal<Set<string>>(new Set());
  const [targetChecked, setTargetChecked] = createSignal<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = createSignal('');
  const [targetFilter, setTargetFilter] = createSignal('');

  const normalizeQuery = (query: string) => query.trim().toLowerCase();
  const filterItems = (items: TransferItem[], query: string) => {
    const normalized = normalizeQuery(query);
    if (!normalized) return items;
    return items.filter((item) => item.label.toLowerCase().includes(normalized));
  };

  const filteredSource = createMemo(() => filterItems(props.sourceItems, sourceFilter()));

  const filteredTarget = createMemo(() => filterItems(props.targetItems, targetFilter()));

  const toggleChecked = (checked: Set<string>, setChecked: (next: Set<string>) => void, id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const toggleSourceChecked = (id: string) => toggleChecked(sourceChecked(), setSourceChecked, id);

  const toggleTargetChecked = (id: string) => toggleChecked(targetChecked(), setTargetChecked, id);

  const moveSelectedRight = () => {
    const checked = sourceChecked();
    const moving = props.sourceItems.filter((item) => checked.has(item.id));
    const remaining = props.sourceItems.filter((item) => !checked.has(item.id));
    setSourceChecked(new Set<string>());
    props.onChange(remaining, [...props.targetItems, ...moving]);
  };

  const moveAllRight = () => {
    setSourceChecked(new Set<string>());
    props.onChange([], [...props.targetItems, ...props.sourceItems]);
  };

  const moveSelectedLeft = () => {
    const checked = targetChecked();
    const moving = props.targetItems.filter((item) => checked.has(item.id));
    const remaining = props.targetItems.filter((item) => !checked.has(item.id));
    setTargetChecked(new Set<string>());
    props.onChange([...props.sourceItems, ...moving], remaining);
  };

  const moveAllLeft = () => {
    setTargetChecked(new Set<string>());
    props.onChange([...props.sourceItems, ...props.targetItems], []);
  };

  const sourceTitle = () => props.sourceTitle ?? 'Available';
  const targetTitle = () => props.targetTitle ?? 'Selected';

  const itemClass = (checked: boolean) => classNames(styles.item, checked && styles.itemChecked);

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Card padding="none" class={styles.panel}>
        <div class={styles.header}>
          <Text as="span" variant="labelMd">
            {sourceTitle()}
          </Text>
          <Text as="span" variant="caption" tone="muted">
            {props.sourceItems.length}
          </Text>
        </div>
        <Show when={props.searchable}>
          <div class={styles.search}>
            <SearchInput
              class={styles.searchInput}
              size="sm"
              value={sourceFilter()}
              onInput={setSourceFilter}
              clearLabel="Clear source search"
              inputAriaLabel={`${sourceTitle()} search`}
            />
          </div>
        </Show>
        <div class={styles.list}>
          <For each={filteredSource()}>
            {(item) => (
              <div class={itemClass(sourceChecked().has(item.id))}>
                <Checkbox
                  wrapperClass={styles.checkboxField}
                  checked={sourceChecked().has(item.id)}
                  onChange={() => toggleSourceChecked(item.id)}
                  label={item.label}
                  aria-label={`Select ${item.label}`}
                />
              </div>
            )}
          </For>
        </div>
      </Card>

      <div class={styles.controls}>
        <IconButton
          disabled={sourceChecked().size === 0}
          onClick={moveSelectedRight}
          title="Move selected to right"
          icon={<IoChevronForward />}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={props.sourceItems.length === 0}
          onClick={moveAllRight}
          title="Move all to right"
          icon={<IoPlayForward />}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={targetChecked().size === 0}
          onClick={moveSelectedLeft}
          title="Move selected to left"
          icon={<IoChevronBack />}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={props.targetItems.length === 0}
          onClick={moveAllLeft}
          title="Move all to left"
          icon={<IoPlayBack />}
          size="sm"
          variant="ghost"
        />
      </div>

      <Card padding="none" class={styles.panel}>
        <div class={styles.header}>
          <Text as="span" variant="labelMd">
            {targetTitle()}
          </Text>
          <Text as="span" variant="caption" tone="muted">
            {props.targetItems.length}
          </Text>
        </div>
        <Show when={props.searchable}>
          <div class={styles.search}>
            <SearchInput
              class={styles.searchInput}
              size="sm"
              value={targetFilter()}
              onInput={setTargetFilter}
              clearLabel="Clear selected search"
              inputAriaLabel={`${targetTitle()} search`}
            />
          </div>
        </Show>
        <div class={styles.list}>
          <For each={filteredTarget()}>
            {(item) => (
              <div class={itemClass(targetChecked().has(item.id))}>
                <Checkbox
                  wrapperClass={styles.checkboxField}
                  checked={targetChecked().has(item.id)}
                  onChange={() => toggleTargetChecked(item.id)}
                  label={item.label}
                  aria-label={`Select ${item.label}`}
                />
              </div>
            )}
          </For>
        </div>
      </Card>
    </div>
  );
};

export default TransferList;
