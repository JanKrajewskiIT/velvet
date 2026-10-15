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

import { createFrameFocus } from '../../hooks/createFrameFocus';
import { ownsLayerEvent } from '../../hooks/createLayer';
import { createTypeahead } from '../../utils/createTypeahead';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { SectionLabel } from '../primitives/SectionLabel';
import { typographyClass } from '../primitives/typography';
import { isActionable, type MenuItem, menuItemKind } from './menuItem';
import { MenuItemContent } from './MenuItemContent';
import styles from './MenuPanel.module.css';

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
  /** @default 'start' */
  iconPosition?: 'start' | 'end';
}

/** The bare menu panel, for custom positioning (ContextMenu uses it). */
export const MenuPanel = (props: MenuPanelProps) => {
  const p = mergeProps({ autoFocus: true, iconPosition: 'start' } satisfies Partial<MenuPanelProps>, props);
  let panel!: HTMLDivElement;
  const id = createUniqueId();
  const itemId = (index: number) => `${id}-${index}`;
  const [highlighted, setActive] = createSignal(-1);
  const search = createTypeahead();
  const focusFrame = createFrameFocus(() => panel);

  const actionable = createMemo(() => p.items.flatMap((item, index) => (isActionable(item) ? [index] : [])));
  const active = () => {
    const index = highlighted();
    if (index < 0) return -1;
    return actionable().includes(index) ? index : (actionable()[0] ?? -1);
  };

  onMount(() => {
    if (!p.autoFocus) return;
    focusFrame();
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
    document
      .getElementById(itemId(index))
      ?.querySelector(classSelector(styles.menuPartLabel))
      ?.textContent.toLowerCase() ?? '';

  const typeahead = (key: string) => {
    const list = actionable();
    const hit = search(key, list.map(labelOf), list.indexOf(active()));
    if (hit >= 0) setActive(list[hit] ?? -1);
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (e.defaultPrevented) return;
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
        if (!ownsLayerEvent(panel)) return;
        e.preventDefault();
        e.stopPropagation();
        p.onClose?.(true);
        break;
      case 'Tab':
        p.onClose?.(true);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeahead(e.key);
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
      class={cx(styles.menu, p.class)}
      style={p.style}
      onKeyDown={onKeyDown}
    >
      <Index each={p.items}>
        {(item, index) => (
          <Switch>
            <Match when={menuItemKind(item()) === 'divider'}>
              <div role="separator" class={styles.menuPartSep} />
            </Match>
            <Match when={menuItemKind(item()) === 'section'}>
              <SectionLabel role="presentation" class={styles.menuPartSection}>
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
                  typographyClass('body'),
                  styles.menuPartItem,
                  index === active() && styles.menuPartItemVariantActive,
                  item().danger && styles.menuPartItemVariantDanger,
                )}
                onMouseEnter={() => !item().disabled && setActive(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(item())}
              >
                <MenuItemContent
                  leading={
                    <Show
                      when={item().checked !== undefined}
                      fallback={<Show when={p.iconPosition === 'start'}>{renderIcon(item().icon)}</Show>}
                    >
                      <span class={styles.menuPartCheck}>
                        <Show when={item().checked}>
                          <Glyph name="check" />
                        </Show>
                      </span>
                    </Show>
                  }
                  label={item().label}
                  description={item().description}
                  shortcut={item().shortcut}
                  trailing={
                    <Show when={item().checked === undefined && p.iconPosition === 'end'}>
                      {renderIcon(item().icon)}
                    </Show>
                  }
                />
              </div>
            </Match>
          </Switch>
        )}
      </Index>
    </div>
  );
};
