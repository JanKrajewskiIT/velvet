import { createMemo, createSignal, For, type JSX, onCleanup, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './VirtualizedList.module.css';

interface VirtualizedListOwnProps<T> extends Omit<DivCoreNativeProps, 'children'> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  renderItem: (item: T, index: number) => JSX.Element;
  emptyState?: JSX.Element;
}

const VirtualizedList = <T,>(props: Props<VirtualizedListOwnProps<T>>) => {
  const { ts } = useI18n();
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

  const overscan = createMemo(() => local.overscan ?? 4);
  const visibleCount = createMemo(() => Math.ceil(local.height / local.itemHeight) + overscan() * 2);
  const startIndex = createMemo(() => Math.max(0, Math.floor(scrollTop() / local.itemHeight) - overscan()));
  const endIndex = createMemo(() => Math.min(local.items.length, startIndex() + visibleCount()));

  const visibleItems = createMemo(() =>
    local.items.slice(startIndex(), endIndex()).map((item, offset) => ({
      item,
      index: startIndex() + offset,
    })),
  );

  const totalHeight = createMemo(() => local.items.length * local.itemHeight);
  const offsetY = createMemo(() => startIndex() * local.itemHeight);
  const viewportStyle = createMemo(() => ({ '--viewport-height': `${String(local.height)}px` }));
  const spacerStyle = createMemo(() => ({ '--total-height': `${String(totalHeight())}px` }));
  const innerStyle = createMemo(() => ({ '--offset-y': `${String(offsetY())}px` }));
  const itemStyle = createMemo(() => ({ '--item-height': `${String(local.itemHeight)}px` }));

  let scrollRafId: number | undefined;
  let pendingScrollTop = 0;
  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    pendingScrollTop = e.currentTarget.scrollTop;
    if (scrollRafId !== undefined) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = undefined;
      setScrollTop(pendingScrollTop);
    });
  };

  onCleanup(() => {
    if (scrollRafId !== undefined) cancelAnimationFrame(scrollRafId);
  });

  return (
    <div
      {...rest}
      class={classNames(styles.viewport, local.class)}
      style={viewportStyle()}
      onScroll={handleScroll}
      role="list"
    >
      <Show
        when={local.items.length > 0}
        fallback={<div class={styles.empty}>{local.emptyState ?? ts('common.noItems')}</div>}
      >
        <div class={styles.spacer} style={spacerStyle()}>
          <div class={styles.inner} style={innerStyle()}>
            <For each={visibleItems()}>
              {(entry) => (
                <div class={styles.item} style={itemStyle()} role="listitem">
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
