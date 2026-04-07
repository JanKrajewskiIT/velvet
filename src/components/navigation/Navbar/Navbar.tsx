import { A, useLocation } from '@solidjs/router';
import { FiMenu, FiX } from 'solid-icons/fi';
import { createEffect, createMemo, createSignal, For, type JSX, on, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Text from '../../typography/Text/Text';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Navbar.module.css';
import type { NavItem } from './NavItem';

interface NavbarProps {
  navItems: NavItem[];
  logo?: JSX.Element;
  actions?: JSX.Element;
}

const hasExactMatch = (path: string, href: string) => path === href;

const Navbar = (props: Props<NavbarProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['navItems', 'logo', 'actions', 'class']);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();

  useEscapeKey(menuOpen, () => setMenuOpen(false));

  const activeIndex = createMemo(() => {
    if (local.navItems.length === 0) return -1;
    const found = local.navItems.findIndex((item) => hasExactMatch(location.pathname, item.href));
    return found === -1 ? 0 : found;
  });

  const activeLabel = createMemo(() => {
    const idx = activeIndex();
    if (idx < 0 || idx >= local.navItems.length) return '';
    return local.navItems[idx]?.label ?? '';
  });

  createEffect(
    on(
      () => location.pathname,
      () => {
        setMenuOpen(false);
      },
    ),
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header {...rest} class={classNames(styles.header, local.class)}>
      {local.logo ?? <div class={styles.logo} />}
      <Text variant="labelLg" tone="inverse" class={styles.activeLabel}>
        {activeLabel()}
      </Text>
      <MenuBar items={local.navItems} activeIndex={activeIndex()} />
      <div class={styles.actions}>
        {local.actions}
        <IconButton
          icon={menuOpen() ? FiX : FiMenu}
          class={styles.hamburger}
          onClick={toggleMenu}
          label={ts('navbar.toggleMenu')}
          aria-expanded={menuOpen()}
          variant="navbar"
          size="sm"
        />
      </div>

      <div class={classNames(styles.mobileOverlay, menuOpen() && styles.open)}>
        <nav class={styles.mobileNav} aria-label={ts('navbar.navigation')}>
          <For each={local.navItems}>
            {(item) => (
              <A href={item.href} class={styles.mobileNavLink}>
                <Icon icon={item.icon} class={styles.mobileNavIcon} />
                <Text as="span" variant="labelLg" tone="inherit">
                  {item.label}
                </Text>
              </A>
            )}
          </For>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
