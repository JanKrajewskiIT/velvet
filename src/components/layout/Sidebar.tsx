import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { SidebarContext } from './sidebarContext';

export interface SidebarProps {
  /** Logo or wordmark — hidden in the rail when the toggle is shown. */
  brand?: JSX.Element;
  /** Compact mark shown in the rail when there is no toggle. */
  brandCollapsed?: JSX.Element;
  /** Pinned to the bottom — e.g. avatar + sign out. */
  footer?: JSX.Element;
  /** @default false */
  collapsed?: boolean;
  /** Shows the collapse/expand toggle in the header. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** floating = raised card; docked = full-height panel with a right border. @default 'floating' */
  variant?: 'floating' | 'docked';
  class?: string;
  children?: JSX.Element;
}

/** App navigation spine: expanded panel or 64px icon rail on the same element. Fill it with NavItem and NavSection. */
export const Sidebar = (props: SidebarProps) => {
  const p = mergeProps({ collapsed: false, variant: 'floating' } satisfies SidebarProps, props);
  const translate = useTranslate();
  const showHead = () => Boolean(p.brand || p.brandCollapsed || p.onCollapsedChange);
  const showRailMark = () => Boolean(p.brandCollapsed && !p.onCollapsedChange);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: () => p.collapsed,
        expand: () => {
          const change = p.onCollapsedChange;
          change?.(false);
          return change !== undefined;
        },
      }}
    >
      <aside class={cx('vui-sidebar', `vui-sidebar--${p.variant}`, p.collapsed && 'vui-sidebar--collapsed', p.class)}>
        <Show when={showHead()}>
          <div class="vui-sidebar__head">
            <Show
              when={p.collapsed}
              fallback={
                <Show when={p.brand}>
                  <div class="vui-sidebar__brand">{p.brand}</div>
                </Show>
              }
            >
              <Show when={showRailMark()}>
                <div class="vui-sidebar__brand vui-sidebar__brand--mark">{p.brandCollapsed}</div>
              </Show>
            </Show>
            <Show when={p.onCollapsedChange}>
              <button
                type="button"
                class="vui-sidebar__toggle"
                aria-label={
                  p.collapsed ? translate('velvet.layout.sidebar.expand') : translate('velvet.layout.sidebar.collapse')
                }
                title={
                  p.collapsed
                    ? translate('velvet.layout.sidebar.expandTitle')
                    : translate('velvet.layout.sidebar.collapseTitle')
                }
                aria-expanded={!p.collapsed}
                onClick={() => p.onCollapsedChange?.(!p.collapsed)}
              >
                <Glyph name="chevrons-left" />
              </button>
            </Show>
          </div>
        </Show>
        <nav class="vui-sidebar__nav">{p.children}</nav>
        <Show when={p.footer}>
          <div class="vui-sidebar__footer">{p.footer}</div>
        </Show>
      </aside>
    </SidebarContext.Provider>
  );
};
