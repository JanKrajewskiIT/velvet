import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Checkmark } from '../primitives/Checkmark';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { Handle } from '../primitives/Handle';
import { highlightMatch } from '../primitives/Mark';
import { SectionLabel } from '../primitives/SectionLabel';
import { SearchInput } from './SearchInput';
import { hasTransferPayload, readTransferPayload, writeTransferPayload } from './transferDrag';
import {
  normalizeSearch,
  searchTextOf,
  type TransferItem,
  type TransferRowState,
  type TransferSide,
} from './transferItem';

export interface TransferPanelLabels {
  title: string;
  moveLabel: string;
  searchPlaceholder: string;
  empty: JSX.Element;
}

export interface TransferPanelProps {
  side: TransferSide;
  items: readonly TransferItem[];
  labels: TransferPanelLabels;
  query: string;
  onQueryChange: (query: string) => void;
  marked: ReadonlySet<string>;
  onMarkedChange: (marked: ReadonlySet<string>) => void;
  /** Moves the given values to the other panel. */
  onMove: (values: string[]) => void;
  /** An item set dropped onto this panel, optionally before one of its rows. */
  onDropIn: (from: TransferSide, values: string[], before?: string) => void;
  /** Present when rows can be reordered (drag, or Alt+↑/↓). */
  onReorder?: (value: string, direction: 1 | -1) => void;
  searchable: boolean;
  groupBy: boolean;
  /** List height in px. */
  height: number;
  /** The right list reached its maximum size. */
  limitHit: boolean;
  renderItem?: (item: TransferItem, state: TransferRowState) => JSX.Element;
}

type DropTarget = { before: string } | 'end' | null;

const ARROW_STEP: Readonly<Record<string, 1 | -1>> = { ArrowDown: 1, ArrowUp: -1 };

/** One side of the TransferList: header with select-all, search, grouped listbox and the move footer. */
export const TransferPanel = (props: TransferPanelProps) => {
  const translate = useTranslate();
  const titleId = createUniqueId();
  const [focus, setFocus] = createSignal(0);
  const [drop, setDrop] = createSignal<DropTarget>(null);
  let anchor: number | undefined;
  let list: HTMLUListElement | undefined;

  const visible = createMemo(() => {
    const needle = normalizeSearch(props.query);
    return needle
      ? props.items.filter((item) => normalizeSearch(searchTextOf(item)).includes(needle))
      : [...props.items];
  });
  const enabled = createMemo(() => visible().filter((item) => !item.disabled));
  const checked = createMemo(() => enabled().filter((item) => props.marked.has(item.value)));
  const allChecked = () => checked().length > 0 && checked().length === enabled().length;
  const someChecked = () => checked().length > 0 && checked().length < enabled().length;
  const orderable = () => !!props.onReorder;

  createEffect(() => {
    if (focus() >= visible().length) setFocus(Math.max(0, visible().length - 1));
  });

  const mark = (values: Iterable<string>) => props.onMarkedChange(new Set(values));
  const toggle = (item: TransferItem, index: number, range: boolean) => {
    if (item.disabled) return;
    const next = new Set(props.marked);
    if (range && anchor !== undefined) {
      const [from = 0, to = 0] = [anchor, index].sort((a, b) => a - b);
      visible()
        .slice(from, to + 1)
        .forEach((x) => !x.disabled && next.add(x.value));
    } else {
      if (!next.delete(item.value)) next.add(item.value);
      anchor = index;
    }
    mark(next);
    setFocus(index);
  };
  const toggleAll = () => {
    const next = new Set(props.marked);
    enabled().forEach((item) => (allChecked() ? next.delete(item.value) : next.add(item.value)));
    mark(next);
  };
  const focusRow = (index: number) => {
    setFocus(index);
    list?.querySelector<HTMLElement>(`[data-k="${index}"]`)?.focus();
  };
  const moveTargets = (fallback?: TransferItem): string[] => {
    if (checked().length) return checked().map((item) => item.value);
    return fallback && !fallback.disabled ? [fallback.value] : [];
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const item = visible()[focus()];
    const step = ARROW_STEP[e.key];
    if (step !== undefined) {
      e.preventDefault();
      if (e.altKey && item && props.onReorder) {
        props.onReorder(item.value, step);
        focusRow(focus() + step);
        return;
      }
      const index = Math.max(0, Math.min(visible().length - 1, focus() + step));
      focusRow(index);
      const target = visible()[index];
      if (e.shiftKey && target && !target.disabled) mark([...props.marked, target.value]);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      focusRow(e.key === 'Home' ? 0 : visible().length - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      if (item) toggle(item, focus(), false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      props.onMove(moveTargets(item));
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      toggleAll();
    }
  };

  const onDragStart = (e: DragEvent, item: TransferItem) => {
    if (item.disabled || !e.dataTransfer) {
      e.preventDefault();
      return;
    }
    writeTransferPayload(e.dataTransfer, {
      from: props.side,
      values: props.marked.has(item.value) ? checked().map((x) => x.value) : [item.value],
    });
  };
  const onDragOver = (e: DragEvent, target: DropTarget) => {
    if (!e.dataTransfer || !hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    setDrop(target);
  };
  const onDrop = (e: DragEvent, before?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDrop(null);
    const payload = e.dataTransfer && readTransferPayload(e.dataTransfer);
    if (payload) props.onDropIn(payload.from, payload.values, before);
  };
  const dropsBefore = (value: string) => {
    const target = drop();
    return typeof target === 'object' && target !== null && target.before === value;
  };

  const groupHeading = (item: TransferItem, index: number): string | undefined => {
    if (!props.groupBy || !item.group) return undefined;
    return item.group === visible()[index - 1]?.group ? undefined : item.group;
  };

  return (
    <section
      class={cx(
        'vui-xfer__panel',
        drop() && 'vui-xfer__panel--drop',
        props.limitHit && props.side === 'right' && 'vui-xfer__panel--full',
      )}
      aria-labelledby={titleId}
      onDragOver={(e) => onDragOver(e, 'end')}
      onDragLeave={(e) => {
        if (!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) setDrop(null);
      }}
      onDrop={(e) => onDrop(e)}
    >
      <header class="vui-xfer__head">
        <Checkmark
          role="checkbox"
          tabIndex={0}
          aria-checked={allChecked() ? true : someChecked() ? 'mixed' : false}
          aria-label={translate('velvet.forms.transferPanel.selectAll', { title: props.labels.title })}
          checked={allChecked()}
          indeterminate={someChecked()}
          disabled={enabled().length === 0}
          onClick={() => enabled().length && toggleAll()}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && enabled().length) {
              e.preventDefault();
              toggleAll();
            }
          }}
        />
        <h3 id={titleId} class="vui-xfer__title">
          {props.labels.title}
        </h3>
        <span class="vui-xfer__count">
          <Show when={checked().length}>
            <b>{checked().length}</b> /{' '}
          </Show>
          {props.items.length}
        </span>
      </header>
      <Show when={props.searchable}>
        <div class="vui-xfer__search">
          <SearchInput
            size="sm"
            value={props.query}
            onValueChange={props.onQueryChange}
            placeholder={props.labels.searchPlaceholder}
            aria-label={translate('velvet.forms.transferPanel.searchLabel', { title: props.labels.title })}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusRow(0);
              }
              if (e.key === 'Escape' && props.query) {
                e.stopPropagation();
                props.onQueryChange('');
              }
            }}
          />
        </div>
      </Show>
      <ul
        ref={list}
        class="vui-xfer__list"
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={titleId}
        style={{ height: `${props.height}px` }}
        onKeyDown={onKeyDown}
      >
        <For each={visible()}>
          {(item, index) => {
            const selected = () => props.marked.has(item.value);
            return (
              <>
                <Show when={groupHeading(item, index())}>
                  {(heading) => (
                    <SectionLabel as="li" role="presentation" class="vui-xfer__group">
                      {heading()}
                    </SectionLabel>
                  )}
                </Show>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the listbox via roving tabindex */}
                <li
                  data-k={index()}
                  role="option"
                  aria-selected={selected()}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={index() === focus() ? 0 : -1}
                  class={cx(
                    'vui-xfer__item',
                    selected() && 'vui-xfer__item--on',
                    item.disabled && 'vui-xfer__item--disabled',
                    dropsBefore(item.value) && 'vui-xfer__item--before',
                  )}
                  draggable={!item.disabled}
                  onDragStart={(e) => onDragStart(e, item)}
                  onDragOver={(e) => orderable() && onDragOver(e, { before: item.value })}
                  onDrop={(e) => orderable() && onDrop(e, item.value)}
                  onClick={(e) => toggle(item, index(), e.shiftKey)}
                  onDblClick={() => !item.disabled && props.onMove([item.value])}
                  onFocus={() => setFocus(index())}
                >
                  <Checkmark checked={selected()} />
                  <Show
                    when={props.renderItem}
                    fallback={
                      <>
                        <Show when={item.avatar || item.icon}>
                          <span class={cx('vui-xfer__lead', item.icon && 'vui-xfer__lead--icon')} aria-hidden="true">
                            <Show when={item.icon} fallback={item.avatar}>
                              {(icon) => <Glyph name={icon()} />}
                            </Show>
                          </span>
                        </Show>
                        <span class="vui-xfer__text">
                          <span class="vui-xfer__label">
                            {typeof item.label === 'string' ? highlightMatch(item.label, props.query) : item.label}
                          </span>
                          <Show when={item.description}>
                            {(description) => (
                              <span class="vui-xfer__desc">{highlightMatch(description(), props.query)}</span>
                            )}
                          </Show>
                        </span>
                        <Show when={item.meta}>
                          <span class="vui-xfer__meta">{item.meta}</span>
                        </Show>
                      </>
                    }
                  >
                    {(render) => render()(item, { query: props.query, selected: selected() })}
                  </Show>
                  <Show when={orderable() && !item.disabled}>
                    <Handle decorative class="vui-xfer__grip" />
                  </Show>
                </li>
              </>
            );
          }}
        </For>
        <Show when={visible().length === 0}>
          <EmptyText as="li" role="presentation" class="vui-xfer__empty">
            <Show when={props.query} fallback={props.labels.empty}>
              {translate('velvet.forms.transferPanel.noMatchesFor', { query: props.query })}
              <button type="button" class="vui-xfer__link" onClick={() => props.onQueryChange('')}>
                {translate('velvet.forms.transferPanel.clearSearch')}
              </button>
            </Show>
          </EmptyText>
        </Show>
        <Show when={drop() === 'end' && visible().length > 0}>
          <li role="presentation" class="vui-xfer__dropline" />
        </Show>
      </ul>
      <footer class="vui-xfer__foot">
        <button
          type="button"
          class="vui-xfer__move"
          disabled={checked().length === 0 || (props.side === 'left' && props.limitHit)}
          onClick={() => props.onMove(checked().map((item) => item.value))}
        >
          <Show when={props.side === 'right'}>
            <Glyph name="arrow-left" />
          </Show>
          {props.labels.moveLabel}
          {checked().length ? ` ${checked().length}` : ''}
          <Show when={props.side === 'left'}>
            <Glyph name="arrow-right" />
          </Show>
        </button>
        <Show when={checked().length > 0}>
          <button
            type="button"
            class="vui-xfer__link"
            onClick={() => mark([...props.marked].filter((value) => !checked().some((item) => item.value === value)))}
          >
            {translate('velvet.forms.transferPanel.deselect')}
          </button>
        </Show>
      </footer>
    </section>
  );
};
