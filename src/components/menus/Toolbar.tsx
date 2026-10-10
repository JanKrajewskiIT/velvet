import { createEffect, createMemo, createSignal, For, Index, type JSX, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Menu, type MenuTriggerProps } from './Menu';
import { ToolbarEntry } from './ToolbarEntry';
import { countFittingItems, isToolbarButton, overflowMenuItems, type ToolbarItem } from './toolbarItem';

/** `data-tb` value of the overflow button; real buttons use their index in `items`. */
const OVERFLOW = -1;
const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

export interface ToolbarProps {
  items: ToolbarItem[];
  /** Accessible name. */
  label?: string;
  /** Overflow button name, followed by the number of hidden tools. @default localized "More tools" */
  moreLabel?: string;
  class?: string;
}

const stopOf = (target: EventTarget | null): number | undefined => {
  const raw = target instanceof Element ? target.closest<HTMLElement>('[data-tb]')?.dataset.tb : undefined;
  return raw === undefined ? undefined : Number(raw);
};

/** Tool row that never wraps: items that do not fit collapse into a "⋯" overflow menu. One tab stop; ←→ / Home / End move focus. */
export const Toolbar = (props: ToolbarProps) => {
  const translate = useTranslate();
  const moreLabel = () => props.moreLabel ?? translate('velvet.menus.toolbar.moreLabel');
  let bar!: HTMLDivElement;
  let measure!: HTMLDivElement;
  const [fit, setFit] = createSignal(Number.POSITIVE_INFINITY);
  const [stopIndex, setStopIndex] = createSignal<number>();

  const measureFit = (items: ToolbarItem[]) => {
    const widths = Array.from(measure.children, (child) => (child instanceof HTMLElement ? child.offsetWidth : 0));
    setFit(countFittingItems(items, widths, bar.clientWidth));
  };

  createEffect(() => measureFit(props.items));
  onMount(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measureFit(props.items));
    observer.observe(bar);
    onCleanup(() => observer.disconnect());
  });

  const entries = createMemo(() => props.items.map((item, index) => ({ item, index })));
  const allFit = () => fit() >= props.items.length;
  const shown = createMemo(() =>
    entries()
      .slice(0, fit())
      .filter(({ item }) => !item.spacer || allFit()),
  );
  const menuItems = createMemo(() => overflowMenuItems(props.items.slice(fit())));
  const hiddenToolCount = () => menuItems().filter((item) => !item.divider).length;

  const focusable = createMemo(() => [
    ...shown()
      .filter(({ item }) => isToolbarButton(item) && !item.disabled)
      .map(({ index }) => index),
    ...(menuItems().length ? [OVERFLOW] : []),
  ]);
  const tabStop = () => {
    const current = stopIndex();
    return current !== undefined && focusable().includes(current) ? current : focusable()[0];
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (!NAVIGATION_KEYS.includes(e.key)) return;
    const stops = focusable();
    const from = stopOf(e.target);
    const at = from === undefined ? -1 : stops.indexOf(from);
    if (at < 0) return;
    e.preventDefault();
    const step = e.key === 'ArrowRight' ? 1 : -1;
    const next =
      e.key === 'Home'
        ? stops[0]
        : e.key === 'End'
          ? stops[stops.length - 1]
          : stops[(at + step + stops.length) % stops.length];
    if (next === undefined) return;
    setStopIndex(next);
    bar.querySelector<HTMLElement>(`[data-tb="${next}"]`)?.focus();
  };

  const overflowButton = (trigger: MenuTriggerProps) => (
    <button
      {...trigger}
      type="button"
      data-tb={OVERFLOW}
      tabIndex={tabStop() === OVERFLOW ? 0 : -1}
      class="vui-toolbar__btn vui-toolbar__more"
      aria-label={translate('velvet.menus.toolbar.overflowLabel', { label: moreLabel(), count: hiddenToolCount() })}
    >
      <Glyph name="more-horizontal" />
    </button>
  );

  return (
    <div
      ref={(element) => {
        bar = element;
      }}
      role="toolbar"
      aria-label={props.label}
      class={cx('vui-toolbar', props.class)}
      onKeyDown={onKeyDown}
      onFocusIn={(e) => {
        const stop = stopOf(e.target);
        if (stop !== undefined) setStopIndex(stop);
      }}
    >
      <div
        ref={(element) => {
          measure = element;
        }}
        class="vui-toolbar__measure"
        aria-hidden="true"
        inert
      >
        <For each={props.items}>{(item) => <ToolbarEntry item={item} tabIndex={-1} />}</For>
      </div>
      <Index each={shown()}>
        {(entry) => (
          <ToolbarEntry item={entry().item} index={entry().index} tabIndex={tabStop() === entry().index ? 0 : -1} />
        )}
      </Index>
      <Show when={menuItems().length}>
        <Menu align="end" items={menuItems()} trigger={overflowButton} />
      </Show>
    </div>
  );
};
