import { createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Navbar.module.css';
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
 * Both collapse to a burger under 768px, or always with `condensed`. Leave ~14px of space below a menubar navbar for the indicator.
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
      class={styles.navbarPartBurger}
      aria-expanded={open()}
      aria-label={open() ? labels().closeMenu : labels().openMenu}
      onClick={() => setOpen(!open())}
    >
      <Glyph name={open() ? 'x' : 'menu'} />
    </button>
  );

  const link = (item: NavbarItem) => (
    <a
      href={navbarHref(item)}
      class={cx(styles.navbarPartLink, typographyClass('button'))}
      aria-current={current(item)}
      onClick={(e) => go(e, item)}
    >
      {renderIcon(item.icon)}
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
            typographyClass('body'),
            styles.navbar,
            p.tone === 'brand' && styles.navbarVariantBrand,
            p.sticky && styles.navbarVariantSticky,
            p.condensed && styles.navbarVariantCondensed,
            open() && 'vui-navbar--open',
            p.class,
          )}
        >
          <div class={styles.navbarPartBar}>
            <Show when={p.brand}>
              <div class={styles.navbarPartBrand}>{p.brand}</div>
            </Show>
            <nav class={styles.navbarPartNav} aria-label={label()}>
              <For each={p.items}>{link}</For>
            </nav>
            <div class={styles.navbarPartActions}>{p.actions}</div>
            {burger()}
          </div>
          <Show when={open()}>
            <nav class={styles.navbarPartPanel} aria-label={mobileLabel()}>
              <For each={p.items}>{link}</For>
            </nav>
          </Show>
        </header>
      }
    >
      <div
        class={cx(
          typographyClass('body'),
          styles.navbarMb,
          p.condensed && styles.navbarMbVariantCondensed,
          p.sticky && styles.navbarVariantSticky,
          p.class,
        )}
      >
        <header class={styles.navbarMbPartBar}>
          <div class={styles.navbarMbPartBrand}>
            <Show when={p.logo != null}>
              <Show when={p.logoHref} fallback={<span class={styles.navbarMbPartLogo}>{p.logo}</span>}>
                {(href) => (
                  <a
                    href={href()}
                    class={styles.navbarMbPartLogo}
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
              <Text as="span" variant="button" tone="inherit" class={styles.navbarMbPartLabel}>
                {activeLabel()}
              </Text>
            </Show>
          </div>
          <NavbarMenuBar
            class={p.condensed ? styles.menuBarHidden : undefined}
            items={p.items}
            active={p.active}
            label={label()}
            onNavigate={go}
          />
          <div class={styles.navbarMbPartActions}>
            {p.actions}
            {burger()}
          </div>
        </header>
        <Show when={open()}>
          <nav class={styles.navbarMbPartOverlay} aria-label={mobileLabel()}>
            <For each={p.items}>
              {(item) => (
                <a
                  href={navbarHref(item)}
                  class={cx(styles.navbarMbPartOlink, typographyClass('button'))}
                  aria-current={current(item)}
                  onClick={(e) => go(e, item)}
                >
                  {renderIcon(item.icon)}
                  <Text as="span" variant="label" tone="inherit">
                    {item.label}
                  </Text>
                </a>
              )}
            </For>
          </nav>
        </Show>
      </div>
    </Show>
  );
};
