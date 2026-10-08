import { mergeProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';

export interface NavbarLocaleProps {
  /** @default 'PL' */
  value?: string;
  onClick?: () => void;
  /** @default localized "Change language" */
  label?: string;
}

/** Glass locale pill for the menubar navbar's actions slot. */
export const NavbarLocale = (props: NavbarLocaleProps) => {
  const p = mergeProps({ value: 'PL' } satisfies Partial<NavbarLocaleProps>, props);
  const translate = useTranslate();
  return (
    <button
      type="button"
      class="vui-navbar-mb__locale"
      aria-label={p.label ?? translate('velvet.navigation.navbarLocale.label')}
      onClick={() => p.onClick?.()}
    >
      {p.value}
    </button>
  );
};
