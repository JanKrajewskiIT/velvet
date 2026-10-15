import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import styles from './Sidebar.module.css';
import { SidebarContext } from './sidebarContext';

const SIDEBAR_CLASSES = {
  floating: styles.sidebarVariantFloating,
  docked: styles.sidebarVariantDocked,
  collapsed: styles.sidebarVariantCollapsed,
} as const;

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
      <aside
        class={cx(
          styles.sidebar,
          variantClass(SIDEBAR_CLASSES, p.variant),
          p.collapsed && styles.sidebarVariantCollapsed,
          p.class,
        )}
      >
        <Show when={showHead()}>
          <div class={styles.sidebarPartHead}>
            <Show
              when={p.collapsed}
              fallback={
                <Show when={p.brand}>
                  <div class={styles.sidebarPartBrand}>{p.brand}</div>
                </Show>
              }
            >
              <Show when={showRailMark()}>
                <div class={cx(styles.sidebarPartBrand, styles.sidebarPartBrandVariantMark)}>{p.brandCollapsed}</div>
              </Show>
            </Show>
            <Show when={p.onCollapsedChange}>
              <button
                type="button"
                class={styles.sidebarPartToggle}
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
        <nav class={styles.sidebarPartNav}>{p.children}</nav>
        <Show when={p.footer}>
          <div class={styles.sidebarPartFooter}>{p.footer}</div>
        </Show>
      </aside>
    </SidebarContext.Provider>
  );
};
