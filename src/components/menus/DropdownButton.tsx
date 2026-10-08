import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { buttonClass, type ButtonSize } from '../actions/buttonClass';
import { Spinner } from '../feedback/Spinner';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { Menu, type MenuTriggerProps } from './Menu';
import type { MenuItem } from './menuItem';

export type DropdownButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';

export interface DropdownButtonProps {
  children?: JSX.Element;
  /** Main action. Omit for a plain menu button. */
  onClick?: () => void;
  items: MenuItem[];
  /** @default 'primary' */
  variant?: DropdownButtonVariant;
  /** @default 'md' */
  size?: Exclude<ButtonSize, 'xs'>;
  icon?: JSX.Element;
  disabled?: boolean;
  loading?: boolean;
  /** aria-label of the chevron. @default localized "More options" */
  menuLabel?: string;
  class?: string;
}

/** With `onClick`: split button, main action plus a chevron menu of alternatives. Without: a single button that opens the menu. */
export const DropdownButton = (props: DropdownButtonProps) => {
  const p = mergeProps({ variant: 'primary' } satisfies Partial<DropdownButtonProps>, props);
  const translate = useTranslate();
  const menuLabel = () => p.menuLabel ?? translate('velvet.menus.dropdownButton.menuLabel');
  const textSkin = () => buttonClass({ variant: p.variant, size: p.size });
  const iconSkin = () => buttonClass({ variant: p.variant, size: p.size, icon: true });

  const menuButton = (trigger: MenuTriggerProps) => (
    <button {...trigger} type="button" class={textSkin()} disabled={p.disabled}>
      {renderIcon(p.icon)}
      {p.children}
      <Glyph name="chevron-down" />
    </button>
  );

  const chevronButton = (trigger: MenuTriggerProps) => (
    <button {...trigger} type="button" class={iconSkin()} aria-label={menuLabel()} disabled={p.disabled}>
      <Glyph name="chevron-down" />
    </button>
  );

  return (
    <Show when={p.onClick} fallback={<Menu align="end" items={p.items} class={p.class} trigger={menuButton} />}>
      <div class={cx('vui-btn-split', `vui-btn-split--${p.variant}`, p.class)} role="group">
        <button type="button" class={textSkin()} disabled={p.disabled || p.loading} onClick={() => p.onClick?.()}>
          <Show when={p.loading}>
            <Spinner size="inline" tone="current" />
          </Show>
          {renderIcon(p.icon)}
          {p.children}
        </button>
        <Menu align="end" items={p.items} trigger={chevronButton} />
      </div>
    </Show>
  );
};
