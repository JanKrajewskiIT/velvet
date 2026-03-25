import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Spinner = (props: Props<SpinnerProps>) => {
  const { t } = useI18n();
  return (
    <div
      role="status"
      aria-label={props.label ?? t('spinner.loading')}
      class={classNames(styles.spinner, styles[props.size ?? 'lg'], props.class)}
    />
  );
};

export default Spinner;
