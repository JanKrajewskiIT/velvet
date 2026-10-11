import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { ThemePreference } from '../../theme/theme';
import { Avatar } from '../data/Avatar';
import { Menu } from '../menus/Menu';
import type { MenuItem } from '../menus/menuItem';
import { Glyph } from '../primitives/Glyph';
import { NavbarAccountPanel } from './NavbarAccountPanel';

export interface NavbarUserProps {
  name?: string;
  src?: string;
  items: MenuItem[];
  /** Name hides under 960px. @default true */
  showName?: boolean;
  /** @default localized "Account menu" */
  label?: string;
  /** Menu min width in px. @default 220 */
  width?: number;
  compact?: boolean;
  email?: string;
  meta?: JSX.Element;
  theme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
  onSignOut?: () => void;
}

/** Account pill for the menubar's actions slot — avatar + first name + chevron → Menu (profile, settings, sign in/out). */
export const NavbarUser = (props: NavbarUserProps) => {
  const p = mergeProps({ showName: true, width: 220 } satisfies Partial<NavbarUserProps>, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.navigation.navbarUser.label');
  const accessibleName = () =>
    p.name ? translate('velvet.navigation.navbarUser.labelWithName', { label: label(), name: p.name }) : label();
  const firstName = () => p.name?.split(' ')[0];

  return (
    <Show
      when={p.compact}
      fallback={
        <Menu
          items={p.items}
          align="end"
          width={p.width}
          trigger={
            <button type="button" class="vui-navbar-mb__user" aria-label={accessibleName()}>
              <Avatar name={p.name} src={p.src} size="sm" tone="neutral" />
              <Show when={p.showName && firstName()}>
                <span class="vui-navbar-mb__user-name">{firstName()}</span>
              </Show>
              <Glyph name="chevron-down" />
            </button>
          }
        />
      }
    >
      <NavbarAccountPanel {...p} label={label()} accessibleName={accessibleName()} />
    </Show>
  );
};
