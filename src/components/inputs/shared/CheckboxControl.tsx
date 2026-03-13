import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CheckboxControl.module.css';

type CheckboxControlOwnProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const CheckboxControl = (props: Props<CheckboxControlOwnProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <span class={classNames(styles.control, local.class)}>
      <input {...rest} type="checkbox" class={styles.input} />
      <span class={styles.indicator} aria-hidden="true" />
    </span>
  );
};

export default CheckboxControl;
