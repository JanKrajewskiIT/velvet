import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CheckboxIndicator.module.css';

interface CheckboxIndicatorProps {
  checked?: boolean;
  class?: string;
}

const CheckboxIndicator = (props: Props<CheckboxIndicatorProps>) => {
  return (
    <span
      class={classNames(styles.indicator, props.checked && styles.indicatorChecked, props.class)}
      aria-hidden="true"
    />
  );
};

export default CheckboxIndicator;
