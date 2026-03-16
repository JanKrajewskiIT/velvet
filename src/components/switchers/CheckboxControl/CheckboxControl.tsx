import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CheckboxControl.module.css';

interface CheckboxControlOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: JSX.Element;
  labelId?: string;
  wrapperClass?: string;
}

const CheckboxControl = (props: Props<CheckboxControlOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'labelId', 'wrapperClass']);

  if (local.label) {
    return (
      <label class={classNames(styles.wrapper, local.wrapperClass)}>
        <span class={classNames(styles.control, local.class)}>
          <input {...rest} type="checkbox" class={styles.input} aria-labelledby={local.labelId} />
          <span class={styles.indicator} aria-hidden="true" />
        </span>
        <span id={local.labelId}>{local.label}</span>
      </label>
    );
  }

  return (
    <span class={classNames(styles.control, local.class)}>
      <input {...rest} type="checkbox" class={styles.input} />
      <span class={styles.indicator} aria-hidden="true" />
    </span>
  );
};

export default CheckboxControl;
