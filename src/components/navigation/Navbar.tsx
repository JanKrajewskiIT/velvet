import { createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { navbarHref, type NavbarItem } from './navbarItem';
import { NavbarMenuBar } from './NavbarMenuBar';

export interface NavbarLabels {
  openMenu: string;
  closeMenu: string;
  /** Landmark name of the collapsed (burger) navigation. */
  mobile: (label: string) => string;
}

export interface NavbarProps {
  /** @default 'links' */
  variant?: 'links' | 'menubar';
  brand?: JSX.Element;
  /** menubar: the brand mark, rendered bare on the bar — pass the full lockup, e.g. a BrandLogo. A string renders as display-font wordmark. */
  logo?: JSX.Element;
  /** menubar: makes the logo a home link */
  logoHref?: string;
  onLogoClick?: () => void;
  items?: NavbarItem[];
  /** id of the current item */
  active?: string;
  /** Called with the item id; the link's default navigation is cancelled */
  onNavigate?: (id: string) => void;
  /** Right-hand slot */
  actions?: JSX.Element;
  /** menubar: show the current item's label next to the logo. @default true */
  showActiveLabel?: boolean;
  /** menubar: override the label text */
  activeLabel?: JSX.Element;
  /** Force the mobile layout (burger + overlay) at any width */
  condensed?: boolean;
  /** links only. @default 'default' */
  tone?: 'default' | 'brand';
  sticky?: boolean;
  /** Landmark name. @default localized "Main" */
  label?: string;
  labels?: Partial<NavbarLabels>;
  class?: string;
}

/**
 * Top app bar. `links` (default): brand · text links · actions; `tone="brand"` paints it brand-coloured.
 * `menubar`: brand-filled 3-column bar — logo (+ current-page label) · centred icon menu with a sliding indicator · actions.
 * Both collapse to a burger under 720px, or always with `condensed`. Leave ~14px of space below a menubar navbar for the indicator.
 */
export const Navbar = (props: NavbarProps) => {
  const p = mergeProps(
    { variant: 'links', items: [], showActiveLabel: true, tone: 'default' } satisfies Partial<NavbarProps>,
    props,
  );
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.navigation.navbar.label');
  const labels = (): NavbarLabels => ({
    openMenu: p.labels?.openMenu ?? translate('velvet.navigation.navbar.openMenu'),
    closeMenu: p.labels?.closeMenu ?? translate('velvet.navigation.navbar.closeMenu'),
    mobile: p.labels?.mobile ?? ((name) => translate('velvet.navigation.navbar.mobile', { label: name })),
  });
  const [open, setOpen] = createSignal(false);
  const mobileLabel = () => labels().mobile(label());

  const go = (e: MouseEvent, item: NavbarItem) => {
    if (p.onNavigate) {
      e.preventDefault();
      p.onNavigate(item.id);
    }
    setOpen(false);
  };
  const current = (item: NavbarItem) => (p.active === item.id ? 'page' : undefined);

  const burger = () => (
    <button
      type="button"
      class="vui-navbar__burger"
      aria-expanded={open()}
      aria-label={open() ? labels().closeMenu : labels().openMenu}
      onClick={() => setOpen(!open())}
    >
      <Glyph name={open() ? 'x' : 'menu'} />
    </button>
  );

  const link = (item: NavbarItem) => (
    <a href={navbarHref(item)} class="vui-navbar__link" aria-current={current(item)} onClick={(e) => go(e, item)}>
      <Show when={item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
      {item.label}
    </a>
  );

  const activeLabel = () => p.activeLabel ?? p.items.find((item) => item.id === p.active)?.label;

  return (
    <Show
      when={p.variant === 'menubar'}
      fallback={
        <header
          class={cx(
            'vui-navbar',
            p.tone === 'brand' && 'vui-navbar--brand',
            p.sticky && 'vui-navbar--sticky',
            p.condensed && 'vui-navbar--condensed',
            open() && 'vui-navbar--open',
            p.class,
          )}
        >
          <div class="vui-navbar__bar">
            <Show when={p.brand}>
              <div class="vui-navbar__brand">{p.brand}</div>
            </Show>
            <nav class="vui-navbar__nav" aria-label={label()}>
              <For each={p.items}>{link}</For>
            </nav>
            <div class="vui-navbar__actions">{p.actions}</div>
            {burger()}
          </div>
          <Show when={open()}>
            <nav class="vui-navbar__panel" aria-label={mobileLabel()}>
              <For each={p.items}>{link}</For>
            </nav>
          </Show>
        </header>
      }
    >
      <div
        class={cx(
          'vui-navbar-mb',
          p.condensed && 'vui-navbar-mb--condensed',
          p.sticky && 'vui-navbar--sticky',
          p.class,
        )}
      >
        <header class="vui-navbar-mb__bar">
          <div class="vui-navbar-mb__brand">
            <Show when={p.logo != null}>
              <Show when={p.logoHref} fallback={<span class="vui-navbar-mb__logo">{p.logo}</span>}>
                {(href) => (
                  <a
                    href={href()}
                    class="vui-navbar-mb__logo"
                    onClick={(e) => {
                      if (!p.onLogoClick) return;
                      e.preventDefault();
                      p.onLogoClick();
                    }}
                  >
                    {p.logo}
                  </a>
                )}
              </Show>
            </Show>
            {p.brand}
            <Show when={p.showActiveLabel && activeLabel()}>
              <span class="vui-navbar-mb__label">{activeLabel()}</span>
            </Show>
          </div>
          <NavbarMenuBar items={p.items} active={p.active} label={label()} onNavigate={go} />
          <div class="vui-navbar-mb__actions">
            {p.actions}
            {burger()}
          </div>
        </header>
        <Show when={open()}>
          <nav class="vui-navbar-mb__overlay" aria-label={mobileLabel()}>
            <For each={p.items}>
              {(item) => (
                <a
                  href={navbarHref(item)}
                  class="vui-navbar-mb__olink"
                  aria-current={current(item)}
                  onClick={(e) => go(e, item)}
                >
                  <Show when={item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                  <span>{item.label}</span>
                </a>
              )}
            </For>
          </nav>
        </Show>
      </div>
    </Show>
  );
};
