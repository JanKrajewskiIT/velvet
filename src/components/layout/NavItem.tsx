import { children, For, type JSX, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Chevron } from '../primitives/Chevron';
import { Count } from '../primitives/Count';
import { renderIcon } from '../primitives/Glyph';
import { useSidebar } from './sidebarContext';

export interface NavSubItem {
  id?: string;
  label: JSX.Element;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface NavItemProps extends HtmlProps<HTMLElement, 'onClick'> {
  /** Glyph name or node. */
  icon?: JSX.Element;
  label?: JSX.Element;
  /** Current page. */
  active?: boolean;
  /** Mono count pill; solid brand when active; a dot in the rail. */
  count?: number | string;
  /** Any trailing node (prefer count). */
  end?: JSX.Element;
  /** Renders an `<a>` when set (ignored with subItems). */
  href?: string;
  /** Nested links — opens by default when one is active. */
  subItems?: NavSubItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClick?: (event: MouseEvent) => void;
}

/** Single navigation link inside Sidebar; with `subItems` it becomes an animated accordion parent. */
export const NavItem = (props: NavItemProps) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'label',
    'active',
    'count',
    'end',
    'href',
    'subItems',
    'open',
    'defaultOpen',
    'onOpenChange',
    'onClick',
    'class',
    'children',
  ]);
  const sidebar = useSidebar();
  const subItems = () => local.subItems ?? [];
  const hasSub = () => subItems().length > 0;
  const childActive = () => subItems().some((item) => item.active);
  const [open, setOpen] = createControllable({
    value: () => local.open,
    defaultValue: local.defaultOpen ?? childActive(),
    onChange: (value) => local.onOpenChange?.(value),
  });
  const isOpen = () => hasSub() && !sidebar.collapsed() && open();
  const text = children(() => local.label || local.children);
  const tip = () => {
    const content = text();
    return sidebar.collapsed() && typeof content === 'string' ? content : undefined;
  };

  const onClick = (event: MouseEvent) => {
    if (hasSub()) {
      if (sidebar.collapsed() && sidebar.expand()) {
        setOpen(true);
      } else {
        setOpen(!isOpen());
      }
    }
    local.onClick?.(event);
  };

  return (
    <>
      <Polymorphic
        tag={local.href && !hasSub() ? 'a' : 'button'}
        {...rest}
        href={local.href && !hasSub() ? local.href : undefined}
        type={local.href && !hasSub() ? undefined : 'button'}
        aria-current={local.active && !hasSub() ? 'page' : undefined}
        aria-expanded={hasSub() ? isOpen() : undefined}
        aria-label={tip()}
        data-tip={tip()}
        class={cx(
          'vui-nav-item',
          (local.active || (sidebar.collapsed() && childActive())) && 'vui-nav-item--active',
          local.count != null && 'vui-nav-item--has-count',
          isOpen() && 'vui-nav-item--open',
          local.class,
        )}
        onClick={onClick}
      >
        {renderIcon(local.icon)}
        <span class="vui-nav-item__label">{text()}</span>
        <Show when={local.count != null}>
          <Count value={local.count} tone="neutral" showZero class="vui-nav-item__count" />
        </Show>
        <Show when={local.end}>
          <span class="vui-nav-item__end">{local.end}</span>
        </Show>
        <Show when={hasSub()}>
          <Chevron direction="right" class="vui-nav-item__caret" />
        </Show>
      </Polymorphic>
      <Show when={hasSub()}>
        <div class={cx('vui-nav-sub', isOpen() && 'vui-nav-sub--open')} aria-hidden={!isOpen() || undefined}>
          <div class="vui-nav-sub__inner">
            <For each={subItems()}>
              {(item) => (
                <Polymorphic
                  tag={item.href ? 'a' : 'button'}
                  href={item.href}
                  type={item.href ? undefined : 'button'}
                  tabIndex={isOpen() ? undefined : -1}
                  aria-current={item.active ? 'page' : undefined}
                  class="vui-nav-sub__link"
                  onClick={() => item.onClick?.()}
                >
                  {item.label}
                </Polymorphic>
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};
