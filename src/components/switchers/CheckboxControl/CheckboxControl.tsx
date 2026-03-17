import type { JSX } from 'solid-js';
import { Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

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
  const hasLabel = () => Boolean(local.label);

  return (
    <Dynamic
      component={hasLabel() ? 'label' : 'span'}
      class={classNames(hasLabel() && styles.wrapper, local.wrapperClass)}
    >
      <span class={classNames(styles.control, local.class)}>
        <input
          {...rest}
          type="checkbox"
          class={styles.input}
          aria-labelledby={hasLabel() ? local.labelId : undefined}
        />
        <span class={styles.indicator} aria-hidden="true" />
      </span>
      <Show when={hasLabel()}>
        <span id={local.labelId}>{local.label}</span>
      </Show>
    </Dynamic>
  );
};

export default CheckboxControl;
