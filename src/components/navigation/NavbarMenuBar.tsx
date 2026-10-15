import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { glyphForState } from './filledGlyph';
import { navbarHref, type NavbarItem } from './navbarItem';
import styles from './NavbarMenuBar.module.css';

export interface NavbarMenuBarProps {
  items: NavbarItem[];
  class?: string;
  active?: string;
  label: string;
  onNavigate: (event: MouseEvent, item: NavbarItem) => void;
}

/** Icon menu of the `menubar` Navbar; the active icon sits in a ring that slides along the list. */
export const NavbarMenuBar = (props: NavbarMenuBarProps) => {
  const activeIndex = () => props.items.findIndex((item) => item.id === props.active);
  return (
    <nav class={cx(styles.navbarPartMenubar, props.class)} aria-label={props.label}>
      <ul class={styles.navbarPartMenulist} style={{ '--nb-i': Math.max(0, activeIndex()) }}>
        <For each={props.items}>
          {(item) => {
            const on = () => props.active === item.id;
            return (
              <li class={cx(styles.navbarPartMitem, on() && styles.navbarPartMitemVariantActive)}>
                <a
                  href={navbarHref(item)}
                  class={styles.navbarPartMlink}
                  aria-label={item.label}
                  title={item.label}
                  aria-current={on() ? 'page' : undefined}
                  onClick={(e) => props.onNavigate(e, item)}
                >
                  <Glyph name={glyphForState(item.icon ?? 'circle', on())} class={styles.navbarPartMicon} />
                </a>
              </li>
            );
          }}
        </For>
        <Show when={activeIndex() >= 0}>
          <li class={styles.navbarPartIndicator} aria-hidden="true">
            <span class={styles.navbarPartRing} />
          </li>
        </Show>
      </ul>
    </nav>
  );
};
