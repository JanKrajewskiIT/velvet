import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonVariant } from '../Button/Button';
import styles from './LocaleSwitcher.module.css';

interface LocaleSwitcherProps {
  variant?: ButtonVariant;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = () => (locale() === 'en' ? 'pl' : 'en');

  return (
    <Button
      class={classNames(styles.root, props.class)}
      size="sm"
      variant={props.variant}
      onClick={() => setLocale(nextLocale())}
      aria-label={t('locale.switchLanguage')}
      data-locale={locale()}
      label={locale().toUpperCase()}
    />
  );
};

export default LocaleSwitcher;
