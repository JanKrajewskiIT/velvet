import { createMemo, splitProps } from 'solid-js';

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
  const [local, rest] = splitProps(props, ['class', 'size', 'label']);
  const ariaLabel = createMemo(() => local.label ?? t('spinner.loading'));
  const sizeClass = createMemo(() => styles[local.size ?? 'lg']);

  return (
    <div
      {...rest}
      role="status"
      aria-label={ariaLabel()}
      class={classNames(styles.spinner, sizeClass(), local.class)}
    />
  );
};

export default Spinner;
