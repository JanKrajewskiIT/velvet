import {
  createEffect,
  createSignal,
  createUniqueId,
  For,
  type JSX,
  mergeProps,
  on,
  onCleanup,
  onMount,
  Show,
  splitProps,
  untrack,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { activeItemKey } from '../../utils/activeItem';
import { assignRef } from '../../utils/assignRef';
import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { renderIcon } from '../primitives/Glyph';
import { tabIds } from './tabIds';

export interface TabItem {
  value: string;
  label: JSX.Element;
  icon?: JSX.Element;
  count?: number;
  disabled?: boolean;
  id?: string;
  panelId?: string;
}

export interface TabsProps extends HtmlProps<HTMLDivElement, 'onChange' | 'children'> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string) => void;
  /** underline = page sections · segmented = compact view toggle. @default 'underline' */
  variant?: 'underline' | 'segmented';
  /** vertical = settings-style list (underline variant only). @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  block?: boolean;
  /** Use manual activation for panels that must load before display. @default 'automatic' */
  activation?: 'automatic' | 'manual';
}

const ENABLED_TAB = '[role="tab"]:not(:disabled)';
const ARROW_KEYS = {
  horizontal: { previous: 'ArrowLeft', next: 'ArrowRight' },
  vertical: { previous: 'ArrowUp', next: 'ArrowDown' },
} as const;

/** Tab switcher with a sliding indicator. Arrow keys / Home / End move and select (roving tabindex). */
export const Tabs = (props: TabsProps) => {
  const merged = mergeProps({ variant: 'underline', orientation: 'horizontal' } satisfies Partial<TabsProps>, props);
  const [local, rest] = splitProps(merged, [
    'items',
    'value',
    'defaultValue',
    'onValueChange',
    'onChange',
    'variant',
    'orientation',
    'block',
    'class',
    'onKeyDown',
    'activation',
    'id',
    'ref',
  ]);
  const [value, select] = createControllable<string | undefined>({
    value: () => local.value,
    defaultValue: untrack(() => props.defaultValue ?? props.items.find((item) => !item.disabled)?.value),
    onChange: (value) => {
      if (value !== undefined) (local.onValueChange ?? local.onChange)?.(value);
    },
  });
  const availableKey = (key: string | undefined) =>
    activeItemKey(
      local.items,
      key,
      (item) => item.value,
      (item) => !item.disabled,
    );
  const current = () => (local.value === undefined ? availableKey(value()) : value());
  const [focused, setFocused] = createSignal<string>();
  const tabStop = () => availableKey(local.activation === 'manual' ? (focused() ?? current()) : current());
  const autoId = createUniqueId();
  const id = () => local.id ?? autoId;
  const vertical = () => local.orientation === 'vertical' && local.variant !== 'segmented';
  const [indicator, setIndicator] = createSignal<JSX.CSSProperties | null>(null);
  let list!: HTMLDivElement;

  const measure = () => {
    const tab = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!tab) return setIndicator(null);
    if (vertical())
      return setIndicator({ transform: `translateY(${tab.offsetTop}px)`, height: `${tab.offsetHeight}px` });
    const lift = local.variant === 'segmented' ? ` translateY(${tab.offsetTop}px)` : '';
    setIndicator({ transform: `translateX(${tab.offsetLeft}px)${lift}`, width: `${tab.offsetWidth}px` });
  };

  createEffect(on([current, () => local.items, tabStop, vertical, () => local.variant], measure));

  onMount(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    let disposed = false;
    void document.fonts.ready
      .then(() => {
        if (!disposed) measure();
      })
      .catch(reportAsyncError);
    onCleanup(() => {
      disposed = true;
      observer.disconnect();
    });
  });

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented) return;
    const keys = ARROW_KEYS[vertical() ? 'vertical' : 'horizontal'];
    const enabled = local.items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const focusedTab = e.target instanceof Element ? e.target.closest<HTMLElement>('[role="tab"]') : undefined;
    let index = enabled.findIndex((item) => item.value === (focusedTab?.dataset.value ?? tabStop()));
    if (e.key === keys.next) index = (index + 1) % enabled.length;
    else if (e.key === keys.previous) index = (index - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') index = 0;
    else if (e.key === 'End') index = enabled.length - 1;
    else return;
    e.preventDefault();
    const target = enabled[index];
    if (!target) return;
    setFocused(target.value);
    if (local.activation !== 'manual') select(target.value);
    list.querySelectorAll<HTMLElement>(ENABLED_TAB)[index]?.focus();
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- tablist focus roves on the tab children (roving tabindex), the container itself is not a tab stop
    <div
      {...rest}
      ref={(element) => {
        list = element;
        assignRef(local.ref, element);
      }}
      id={id()}
      role="tablist"
      aria-orientation={vertical() ? 'vertical' : 'horizontal'}
      onKeyDown={onKeyDown}
      class={cx(
        'vui-tabs',
        indicator() && 'vui-tabs--js',
        local.variant === 'segmented' && 'vui-tabs--segmented',
        vertical() && 'vui-tabs--vertical',
        local.block && 'vui-tabs--block',
        local.class,
      )}
    >
      <Show when={indicator()}>
        {(style) => <span class="vui-tabs__indicator" style={style()} aria-hidden="true" />}
      </Show>
      <For each={local.items}>
        {(item) => (
          <button
            data-value={item.value}
            id={item.id ?? tabIds(id(), item.value).tab}
            aria-controls={item.panelId ?? tabIds(id(), item.value).panel}
            role="tab"
            type="button"
            aria-selected={current() === item.value}
            tabIndex={!item.disabled && tabStop() === item.value ? 0 : -1}
            disabled={item.disabled}
            class="vui-tab"
            onClick={() => !item.disabled && select(item.value)}
            onFocus={() => setFocused(item.value)}
          >
            {renderIcon(item.icon)}
            {item.label}
            <Show when={item.count != null}>
              <span class="vui-tab__count">{item.count}</span>
            </Show>
          </button>
        )}
      </For>
    </div>
  );
};
