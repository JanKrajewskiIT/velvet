import { For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { createVirtualKeyboard } from './createVirtualKeyboard';
import { createVirtualRows, DEFAULT_ITEM_HEIGHT, DEFAULT_OVERSCAN } from './createVirtualRows';
import { createVirtualScroll } from './createVirtualScroll';
import { createVirtualSelection } from './createVirtualSelection';
import type { VirtualListConfig, VirtualListProps } from './virtualListTypes';

export type { VirtualListItemState, VirtualListProps } from './virtualListTypes';

const LOADING_ROW_HEIGHT = 44;

/**
 * Windowed list for thousands of rows — only the visible window (+ overscan) is in the DOM. Fixed `itemHeight`, or known variable
 * heights via `getItemHeight` (prefix-sum offsets, binary search). Invalid sizes fall back to safe defaults; duplicate keys warn and
 * fall back to key+index so rows never collide. Keyboard: ↑↓ PgUp PgDn Home End, Enter activates, Space/Enter selects.
 * Infinite loading: `onEndReached` fires once per growth when within `endThreshold` px of the bottom; `loading` shows a footer row.
 * For tabular data with columns use VirtualTable.
 */
export const VirtualList = <T,>(props: VirtualListProps<T>): JSX.Element => {
  const p: VirtualListConfig<T> = mergeProps(
    {
      itemHeight: DEFAULT_ITEM_HEIGHT,
      height: 400,
      overscan: DEFAULT_OVERSCAN,
      gap: 0,
      selectable: false,
      endThreshold: 200,
      loading: false,
      divided: false,
    } satisfies Partial<VirtualListProps<T>>,
    props,
  );
  const translate = useTranslate();
  const loadingLabel = () => p.loadingLabel ?? translate('velvet.data.virtualList.loadingLabel');
  const empty = () => p.empty ?? translate('velvet.data.virtualList.empty');
  const { scrollTop, onScroll } = createVirtualScroll(p);
  const rows = createVirtualRows(p, scrollTop);
  const { count, gap, offsetAt, total, first, windowIndices } = rows;
  const { isSelected, select, multiselectable } = createVirtualSelection(p);
  let box!: HTMLDivElement;
  const { focus, setFocus, goTo, onKey } = createVirtualKeyboard(p, rows, select, () => box);

  return (
    <div class={cx('vui-vlist', p.divided && 'vui-vlist--divided', p.class)}>
      <div
        ref={box}
        class="vui-vlist__scroll"
        style={{ height: `${p.height}px` }}
        role={p.selectable ? 'listbox' : 'list'}
        aria-label={p.label}
        aria-multiselectable={multiselectable()}
        aria-busy={p.loading || undefined}
        tabIndex={focus() < 0 ? 0 : -1}
        onScroll={onScroll}
        onKeyDown={onKey}
        onFocus={(e) => {
          if (e.target === e.currentTarget && count()) goTo(first());
        }}
      >
        <Show when={count() > 0 || p.loading} fallback={<EmptyText class="vui-vlist__empty">{empty()}</EmptyText>}>
          <div class="vui-vlist__inner" style={{ height: `${total() + (p.loading ? LOADING_ROW_HEIGHT : 0)}px` }}>
            <For each={windowIndices()}>
              {(i) => {
                const selected = () => isSelected(i);
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- option rows are driven by the listbox owner's onKeyDown (roving tabindex)
                  <div
                    data-vi={i}
                    role={p.selectable ? 'option' : 'listitem'}
                    aria-selected={p.selectable ? selected() : undefined}
                    aria-setsize={count()}
                    aria-posinset={i + 1}
                    tabIndex={i === focus() ? 0 : -1}
                    class={cx(
                      'vui-vlist__item',
                      i === focus() && 'vui-vlist__item--focus',
                      selected() && 'vui-vlist__item--selected',
                      (p.onSelect || p.onActivate) && 'vui-vlist__item--click',
                    )}
                    style={{ top: `${offsetAt(i)}px`, height: `${offsetAt(i + 1) - offsetAt(i) - gap()}px` }}
                    onClick={() => {
                      const item = p.items[i];
                      setFocus(i);
                      if (item === undefined) return;
                      select(i, item);
                      p.onActivate?.(item, i);
                    }}
                  >
                    {p.renderItem?.(p.items[i] as T, i, { selected: selected(), focused: i === focus() }) ??
                      String(p.items[i])}
                  </div>
                );
              }}
            </For>
            <Show when={p.loading}>
              <div class="vui-vlist__loading" style={{ top: `${total()}px` }} role="status">
                <span class="vui-loader vui-loader--ring vui-loader--sm" aria-hidden="true" />
                {loadingLabel()}
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};
