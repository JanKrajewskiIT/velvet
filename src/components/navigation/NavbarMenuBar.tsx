import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { glyphForState } from './filledGlyph';
import { navbarHref, type NavbarItem } from './navbarItem';

export interface NavbarMenuBarProps {
  items: NavbarItem[];
  active?: string;
  label: string;
  onNavigate: (event: MouseEvent, item: NavbarItem) => void;
}

/** Icon menu of the `menubar` Navbar; the active icon sits in a ring that slides along the list. */
export const NavbarMenuBar = (props: NavbarMenuBarProps) => {
  const activeIndex = () => props.items.findIndex((item) => item.id === props.active);
  return (
    <nav class="vui-navbar__menubar" aria-label={props.label}>
      <ul class="vui-navbar__menulist" style={{ '--nb-i': Math.max(0, activeIndex()) }}>
        <For each={props.items}>
          {(item) => {
            const on = () => props.active === item.id;
            return (
              <li class={cx('vui-navbar__mitem', on() && 'vui-navbar__mitem--active')}>
                <a
                  href={navbarHref(item)}
                  class="vui-navbar__mlink"
                  aria-label={item.label}
                  title={item.label}
                  aria-current={on() ? 'page' : undefined}
                  onClick={(e) => props.onNavigate(e, item)}
                >
                  <Glyph name={glyphForState(item.icon ?? 'circle', on())} class="vui-navbar__micon" />
                </a>
              </li>
            );
          }}
        </For>
        <Show when={activeIndex() >= 0}>
          <li class="vui-navbar__indicator" aria-hidden="true">
            <span class="vui-navbar__ring" />
          </li>
        </Show>
      </ul>
    </nav>
  );
};
