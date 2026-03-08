import { A, useLocation } from '@solidjs/router';
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  on,
} from 'solid-js';

import useEscapeKey from '../../../hooks/useEscapeKey';
import type Props from '../../../models/Props';
import MenuBar from './MenuBar';
import styles from './Navbar.module.css';
import type { NavItem } from './NavItem';

interface NavbarProps {
  navItems: NavItem[];
  logo?: JSX.Element;
  actions?: JSX.Element;
  toggleMenuLabel: string;
  navLabel?: string;
}

const Navbar = (props: Props<NavbarProps>) => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();

  useEscapeKey(menuOpen, () => setMenuOpen(false));

  const activeIndex = createMemo(() => {
    if (props.navItems.length === 0) return -1;
    const found = props.navItems.findIndex(
      (item) => item.href === location.pathname
    );
    return found === -1 ? 0 : found;
  });

  const activeLabel = createMemo(() => {
    const idx = activeIndex();
    if (idx < 0 || idx >= props.navItems.length) return '';
    return props.navItems[idx]?.label ?? '';
  });

  createEffect(
    on(
      () => location.pathname,
      () => {
        setMenuOpen(false);
      }
    )
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header class={`${styles.header} ${props.class ?? ''}`}>
      {props.logo ?? <div class={styles.logo} />}
      <span class={styles.activeLabel}>{activeLabel()}</span>
      <MenuBar
        items={props.navItems}
        activeIndex={activeIndex()}
        navLabel={props.navLabel}
      />
      <div class={styles.actions}>
        {props.actions}
        <button
          class={`${styles.hamburger} ${menuOpen() ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label={props.toggleMenuLabel}
          aria-expanded={menuOpen()}
        >
          <span class={styles.hamburgerLine} />
          <span class={styles.hamburgerLine} />
          <span class={styles.hamburgerLine} />
        </button>
      </div>

      <div class={`${styles.mobileOverlay} ${menuOpen() ? styles.open : ''}`}>
        <nav class={styles.mobileNav}>
          <For each={props.navItems}>
            {(item) => (
              <A href={item.href} class={styles.mobileNavLink}>
                <item.icon class={styles.mobileNavIcon} />
                {item.label}
              </A>
            )}
          </For>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
