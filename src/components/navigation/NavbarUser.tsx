import { mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Avatar } from '../data/Avatar';
import { Menu } from '../menus/Menu';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { NavbarAccountPanel } from './NavbarAccountPanel';
import styles from './NavbarUser.module.css';
import type { NavbarUserProps } from './navbarUserTypes';

export type { NavbarUserProps } from './navbarUserTypes';

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
            <button
              type="button"
              class={cx(styles.navbarMbPartUser, typographyClass('label'))}
              aria-label={accessibleName()}
            >
              <Avatar class={styles.userAvatar} name={p.name} src={p.src} size="sm" tone="neutral" />
              <Show when={p.showName && firstName()}>
                <Text as="span" variant="label" tone="inherit" class={styles.navbarMbPartUserName}>
                  {firstName()}
                </Text>
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
