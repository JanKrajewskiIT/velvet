import { splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type { Locale } from '~/i18n/registry';
import { SUPPORTED_LOCALES } from '~/i18n/registry';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../Button/Button';
import type { ButtonVariant } from '../shared/buttonVariants';
import styles from './LocaleSwitcher.module.css';

interface LocaleSwitcherProps {
  locales?: readonly Locale[] | Locale[];
  variant?: ButtonVariant;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  const { ts, locale, setLocale } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'variant', 'locales']);
  const availableLocales = () => local.locales ?? SUPPORTED_LOCALES;
  const nextLocale = (): Locale => {
    const locales = availableLocales();
    if (locales.length === 0) return locale();
    const currentIndex = locales.indexOf(locale());
    const nextIndex = (currentIndex + 1) % locales.length;
    return locales[nextIndex] ?? locales[0] ?? locale();
  };

  const handleClick = () => setLocale(nextLocale());

  return (
    <Button
      {...rest}
      class={classNames(styles.root, local.class)}
      size="sm"
      variant={local.variant}
      onClick={handleClick}
      aria-label={ts('locale.switchLanguage')}
      data-locale={locale()}
      label={locale().toUpperCase()}
    />
  );
};

export type { LocaleSwitcherProps };
export default LocaleSwitcher;
