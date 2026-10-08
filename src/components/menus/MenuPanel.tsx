import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  Index,
  type JSX,
  Match,
  mergeProps,
  onMount,
  Show,
  Switch,
} from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Kbd } from '../primitives/Kbd';
import { SectionLabel } from '../primitives/SectionLabel';
import { isActionable, type MenuItem, menuItemKind } from './menuItem';

const TYPEAHEAD_RESET_MS = 600;
const SCROLL_PADDING_PX = 8;

export interface MenuPanelProps {
  items: MenuItem[];
  /** `refocus` is true when focus should return to whatever opened the panel. */
  onClose?: (refocus: boolean) => void;
  style?: JSX.CSSProperties;
  class?: string;
  /** Receives the panel element once mounted. */
  ref?: (element: HTMLDivElement) => void;
  /** Focus the panel and activate the first item on mount. @default true */
  autoFocus?: boolean;
}

/** The bare menu panel, for custom positioning (ContextMenu uses it). */
export const MenuPanel = (props: MenuPanelProps) => {
  const p = mergeProps({ autoFocus: true } satisfies Partial<MenuPanelProps>, props);
  let panel!: HTMLDivElement;
  const id = createUniqueId();
  const itemId = (index: number) => `${id}-${index}`;
  const [active, setActive] = createSignal(-1);
  const typed = { text: '', at: 0 };

  const actionable = createMemo(() => p.items.flatMap((item, index) => (isActionable(item) ? [index] : [])));

  onMount(() => {
    if (!p.autoFocus) return;
    panel.focus({ preventScroll: true });
    setActive(actionable()[0] ?? -1);
  });

  createEffect(() => {
    const el = active() >= 0 ? document.getElementById(itemId(active())) : null;
    if (
      el &&
      (el.offsetTop < panel.scrollTop || el.offsetTop + el.offsetHeight > panel.scrollTop + panel.clientHeight)
    ) {
      panel.scrollTop = el.offsetTop - SCROLL_PADDING_PX;
    }
  });

  const move = (direction: 1 | -1) => {
    const list = actionable();
    if (!list.length) return;
    const at = list.indexOf(active());
    const next =
      at < 0 ? (direction > 0 ? list[0] : list[list.length - 1]) : list[(at + direction + list.length) % list.length];
    if (next !== undefined) setActive(next);
  };

  const choose = (item: MenuItem | undefined) => {
    if (!item || !isActionable(item)) return;
    item.onSelect?.();
    if (!item.keepOpen) p.onClose?.(true);
  };

  const labelOf = (index: number) =>
    document.getElementById(itemId(index))?.querySelector('.vui-menu__label')?.textContent.toLowerCase() ?? '';

  const typeahead = (key: string) => {
    const now = Date.now();
    typed.text = (now - typed.at > TYPEAHEAD_RESET_MS ? '' : typed.text) + key.toLowerCase();
    typed.at = now;
    const hit = actionable().find((index) => labelOf(index).startsWith(typed.text));
    if (hit !== undefined) setActive(hit);
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const list = actionable();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActive(list[0] ?? -1);
        break;
      case 'End':
        e.preventDefault();
        setActive(list[list.length - 1] ?? -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(p.items[active()]);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        p.onClose?.(true);
        break;
      case 'Tab':
        p.onClose?.(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeahead(e.key);
    }
  };

  return (
    <div
      ref={(element) => {
        panel = element;
        p.ref?.(element);
      }}
      role="menu"
      tabIndex={-1}
      aria-activedescendant={active() >= 0 ? itemId(active()) : undefined}
      class={cx('vui-menu', p.class)}
      style={p.style}
      onKeyDown={onKeyDown}
    >
      <Index each={p.items}>
        {(item, index) => (
          <Switch>
            <Match when={menuItemKind(item()) === 'divider'}>
              <div role="separator" class="vui-menu__sep" />
            </Match>
            <Match when={menuItemKind(item()) === 'section'}>
              <SectionLabel role="presentation" class="vui-menu__section">
                {item().section}
              </SectionLabel>
            </Match>
            <Match when={menuItemKind(item()) === 'item'}>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- menuitems are driven by aria-activedescendant on the menu, which owns keyboard handling */}
              <div
                id={itemId(index)}
                role={item().checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
                aria-checked={item().checked !== undefined ? !!item().checked : undefined}
                aria-disabled={item().disabled || undefined}
                class={cx(
                  'vui-menu__item',
                  index === active() && 'vui-menu__item--active',
                  item().danger && 'vui-menu__item--danger',
                )}
                onMouseEnter={() => !item().disabled && setActive(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(item())}
              >
                <Show when={item().checked !== undefined} fallback={renderIcon(item().icon)}>
                  <span class="vui-menu__check">
                    <Show when={item().checked}>
                      <Glyph name="check" />
                    </Show>
                  </span>
                </Show>
                <span class="vui-menu__label">
                  {item().label}
                  <Show when={item().description}>
                    <span class="vui-menu__desc">{item().description}</span>
                  </Show>
                </span>
                <Show when={item().shortcut}>
                  <Kbd plain class="vui-menu__kbd">
                    {item().shortcut}
                  </Kbd>
                </Show>
              </div>
            </Match>
          </Switch>
        )}
      </Index>
    </div>
  );
};
