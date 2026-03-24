import { createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './VirtualizedList.module.css';

interface VirtualizedListOwnProps<T> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  renderItem: (item: T, index: number) => JSX.Element;
  emptyState?: JSX.Element;
}

const VirtualizedList = <T,>(props: Props<VirtualizedListOwnProps<T>>) => {
  const [local, rest] = splitProps(props, [
    'items',
    'itemHeight',
    'height',
    'overscan',
    'renderItem',
    'emptyState',
    'class',
  ]);
  const [scrollTop, setScrollTop] = createSignal(0);

  const overscan = () => local.overscan ?? 4;
  const visibleCount = createMemo(() => Math.ceil(local.height / local.itemHeight) + overscan() * 2);
  const startIndex = createMemo(() => Math.max(0, Math.floor(scrollTop() / local.itemHeight) - overscan()));
  const endIndex = createMemo(() => Math.min(local.items.length, startIndex() + visibleCount()));

  const visibleItems = createMemo(() =>
    local.items.slice(startIndex(), endIndex()).map((item, offset) => ({
      item,
      index: startIndex() + offset,
    }))
  );

  const totalHeight = createMemo(() => local.items.length * local.itemHeight);
  const offsetY = createMemo(() => startIndex() * local.itemHeight);

  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      {...rest}
      class={classNames(styles.viewport, local.class)}
      style={{ height: `${local.height}px` }}
      onScroll={handleScroll}
      role="list"
    >
      <Show when={local.items.length > 0} fallback={<div class={styles.empty}>{local.emptyState ?? 'No items'}</div>}>
        <div class={styles.spacer} style={{ height: `${totalHeight()}px` }}>
          <div class={styles.inner} style={{ transform: `translateY(${offsetY()}px)` }}>
            <For each={visibleItems()}>
              {(entry) => (
                <div class={styles.item} style={{ height: `${local.itemHeight}px` }} role="listitem">
                  {local.renderItem(entry.item, entry.index)}
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default VirtualizedList;
