import { mergeProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { typographyClass } from '../primitives/typography';
import styles from './NavbarLocale.module.css';

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
      class={cx(styles.navbarMbPartLocale, typographyClass('label'))}
      aria-label={p.label ?? translate('velvet.navigation.navbarLocale.label')}
      onClick={() => p.onClick?.()}
    >
      {p.value}
    </button>
  );
};
