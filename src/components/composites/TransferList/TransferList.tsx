import { IoChevronBack, IoChevronForward, IoPlayBack, IoPlayForward } from 'solid-icons/io';
import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';

import CheckboxControl from '../../inputs/shared/CheckboxControl';
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

  const filteredSource = createMemo(() => {
    const query = sourceFilter().toLowerCase();
    if (!query) return props.sourceItems;
    return props.sourceItems.filter((item) => item.label.toLowerCase().includes(query));
  });

  const filteredTarget = createMemo(() => {
    const query = targetFilter().toLowerCase();
    if (!query) return props.targetItems;
    return props.targetItems.filter((item) => item.label.toLowerCase().includes(query));
  });

  const toggleSourceChecked = (id: string) => {
    const next = new Set(sourceChecked());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSourceChecked(next);
  };

  const toggleTargetChecked = (id: string) => {
    const next = new Set(targetChecked());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setTargetChecked(next);
  };

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

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <div class={styles.panel}>
        <div class={styles.header}>
          <span>{props.sourceTitle ?? 'Available'}</span>
          <span class={styles.count}>{props.sourceItems.length}</span>
        </div>
        <Show when={props.searchable}>
          <div class={styles.search}>
            <input
              class={styles.searchInput}
              type="text"
              value={sourceFilter()}
              onInput={(e) => setSourceFilter(e.currentTarget.value)}
            />
          </div>
        </Show>
        <div class={styles.list}>
          <For each={filteredSource()}>
            {(item) => (
              <label class={`${styles.item} ${sourceChecked().has(item.id) ? styles.itemChecked : ''}`}>
                <CheckboxControl
                  class={styles.checkbox}
                  checked={sourceChecked().has(item.id)}
                  onChange={() => toggleSourceChecked(item.id)}
                  aria-label={`Select ${item.label}`}
                />
                {item.label}
              </label>
            )}
          </For>
        </div>
      </div>

      <div class={styles.controls}>
        <button
          type="button"
          class={styles.controlBtn}
          disabled={sourceChecked().size === 0}
          onClick={moveSelectedRight}
        >
          <IoChevronForward />
        </button>
        <button
          type="button"
          class={styles.controlBtn}
          disabled={props.sourceItems.length === 0}
          onClick={moveAllRight}
        >
          <IoPlayForward />
        </button>
        <button
          type="button"
          class={styles.controlBtn}
          disabled={targetChecked().size === 0}
          onClick={moveSelectedLeft}
        >
          <IoChevronBack />
        </button>
        <button type="button" class={styles.controlBtn} disabled={props.targetItems.length === 0} onClick={moveAllLeft}>
          <IoPlayBack />
        </button>
      </div>

      <div class={styles.panel}>
        <div class={styles.header}>
          <span>{props.targetTitle ?? 'Selected'}</span>
          <span class={styles.count}>{props.targetItems.length}</span>
        </div>
        <Show when={props.searchable}>
          <div class={styles.search}>
            <input
              class={styles.searchInput}
              type="text"
              value={targetFilter()}
              onInput={(e) => setTargetFilter(e.currentTarget.value)}
            />
          </div>
        </Show>
        <div class={styles.list}>
          <For each={filteredTarget()}>
            {(item) => (
              <label class={`${styles.item} ${targetChecked().has(item.id) ? styles.itemChecked : ''}`}>
                <CheckboxControl
                  class={styles.checkbox}
                  checked={targetChecked().has(item.id)}
                  onChange={() => toggleTargetChecked(item.id)}
                  aria-label={`Select ${item.label}`}
                />
                {item.label}
              </label>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default TransferList;
