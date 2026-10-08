import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { clamp, type RowKey, rowValue } from './rowData';

export interface VirtualListItemState {
  selected: boolean;
  focused: boolean;
}

export interface VirtualListProps<T = unknown> {
  items: T[];
  renderItem?: (item: T, index: number, state: VirtualListItemState) => JSX.Element;
  /** Row height px. @default 48 */
  itemHeight?: number;
  /** Per-row height when rows differ (must be known up front). */
  getItemHeight?: (item: T, index: number) => number;
  /** Viewport height px. @default 400 */
  height?: number;
  /** Rows rendered outside the viewport. @default 6 */
  overscan?: number;
  /** Space between rows px. @default 0 */
  gap?: number;
  /** Stable key. @default item.id ?? item.key ?? index */
  getKey?: (item: T, index: number) => RowKey;
  /** listbox semantics + selected styling. */
  selectable?: boolean;
  /** Selected key, or keys (multi). */
  selected?: RowKey | RowKey[];
  onSelect?: (key: RowKey, item: T) => void;
  /** Click / Enter. */
  onActivate?: (item: T, index: number) => void;
  onEndReached?: () => void;
  /** @default 200 */
  endThreshold?: number;
  loading?: boolean;
  /** @default localized "Loading more…" */
  loadingLabel?: string;
  /** @default localized "Nothing to show" */
  empty?: JSX.Element;
  /** Accessible name. */
  label?: string;
  /** Hairline between rows. */
  divided?: boolean;
  class?: string;
}

const DEFAULT_ITEM_HEIGHT = 48;
const DEFAULT_OVERSCAN = 6;
const LOADING_ROW_HEIGHT = 44;

const positiveOr = (value: number, fallback: number) => (Number.isFinite(value) && value > 0 ? value : fallback);

const identityOf = (item: unknown): RowKey | undefined => {
  if (typeof item !== 'object' || item === null) return undefined;
  const id = rowValue(item, 'id') ?? rowValue(item, 'key');
  return typeof id === 'string' || typeof id === 'number' ? id : undefined;
};

/**
 * Windowed list for thousands of rows — only the visible window (+ overscan) is in the DOM. Fixed `itemHeight`, or known variable
 * heights via `getItemHeight` (prefix-sum offsets, binary search). Invalid sizes fall back to safe defaults; duplicate keys warn and
 * fall back to key+index so rows never collide. Keyboard: ↑↓ PgUp PgDn Home End, Enter activates, Space/Enter selects.
 * Infinite loading: `onEndReached` fires once per growth when within `endThreshold` px of the bottom; `loading` shows a footer row.
 * For tabular data with columns use VirtualTable.
 */
export const VirtualList = <T,>(props: VirtualListProps<T>): JSX.Element => {
  const p = mergeProps(
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
  const [scrollTop, setScrollTop] = createSignal(0);
  const [focus, setFocus] = createSignal(-1);
  let box!: HTMLDivElement;
  let endReported = false;

  const baseHeight = () => positiveOr(p.itemHeight, DEFAULT_ITEM_HEIGHT);
  const overscan = () => (Number.isFinite(p.overscan) && p.overscan >= 0 ? Math.floor(p.overscan) : DEFAULT_OVERSCAN);
  const gap = () => (Number.isFinite(p.gap) && p.gap >= 0 ? p.gap : 0);
  const count = () => p.items.length;

  const offsets = createMemo(() => {
    const out = new Float64Array(count() + 1);
    p.items.forEach((item, i) => {
      const height = p.getItemHeight ? p.getItemHeight(item, i) : baseHeight();
      out[i + 1] = (out[i] ?? 0) + positiveOr(height, baseHeight()) + gap();
    });
    return out;
  });
  const offsetAt = (i: number) => offsets()[i] ?? 0;

  const keyInfo = createMemo(() => {
    const seen = new Set<RowKey>();
    let duplicated = false;
    const keys = p.items.map((item, i) => {
      let key = p.getKey ? p.getKey(item, i) : (identityOf(item) ?? i);
      if (seen.has(key)) {
        duplicated = true;
        key = `${key}§${i}`;
      }
      seen.add(key);
      return key;
    });
    return { keys, duplicated };
  });
  createEffect(() => {
    if (keyInfo().duplicated)
      console.warn('VirtualList: duplicate item keys — fell back to key+index. Provide unique ids via getKey.');
  });

  const total = () => (count() ? offsetAt(count()) - gap() : 0);
  /** First row whose bottom edge is below `y`. */
  const rowAt = (y: number) => {
    let lo = 0;
    let hi = count();
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsetAt(mid + 1) <= y) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const first = () => (count() ? rowAt(scrollTop()) : 0);
  const last = () => (count() ? rowAt(scrollTop() + p.height) : -1);
  const windowIndices = createMemo(() => {
    const start = Math.max(0, first() - overscan());
    const end = Math.min(count(), last() + 1 + overscan());
    return Array.from({ length: Math.max(0, end - start) }, (_, k) => start + k);
  });

  createEffect(on(count, () => (endReported = false), { defer: true }));

  const onScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    const el = e.currentTarget;
    setScrollTop(el.scrollTop);
    if (
      p.onEndReached &&
      !p.loading &&
      !endReported &&
      el.scrollHeight - el.scrollTop - el.clientHeight < p.endThreshold
    ) {
      endReported = true;
      p.onEndReached();
    }
  };

  const goTo = (index: number) => {
    const target = clamp(index, 0, count() - 1);
    setFocus(target);
    const top = offsetAt(target);
    const bottom = offsetAt(target + 1) - gap();
    if (top < box.scrollTop) box.scrollTop = top;
    else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight;
    requestAnimationFrame(() =>
      box.querySelector<HTMLElement>(`[data-vi="${target}"]`)?.focus({ preventScroll: true }),
    );
  };

  const isSelected = (i: number) => {
    const key = keyInfo().keys[i];
    return Array.isArray(p.selected) ? p.selected.some((k) => k === key) : p.selected === key;
  };

  const select = (i: number, item: T) => {
    const key = keyInfo().keys[i];
    if (p.selectable && key !== undefined) p.onSelect?.(key, item);
  };

  const onKey: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (!count()) return;
    const page = Math.max(1, last() - first());
    const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: page, PageUp: -page };
    const step = steps[e.key];
    const current = focus();
    const item = p.items[current];
    if (step !== undefined) {
      e.preventDefault();
      goTo((current < 0 ? first() : current) + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(count() - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && current >= 0 && item !== undefined) {
      e.preventDefault();
      select(current, item);
      if (e.key === 'Enter') p.onActivate?.(item, current);
    }
  };

  const multiselectable = () => (p.selectable && Array.isArray(p.selected) ? true : undefined);

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
