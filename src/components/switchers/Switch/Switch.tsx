import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import LabelText from '../../typography/LabelText/LabelText';
import styles from './Switch.module.css';

interface SwitchOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: JSX.Element;
  description?: JSX.Element;
}

const Switch = (props: Props<SwitchOwnProps>) => {
  const [local, rest] = splitProps(props, ['checked', 'onChange', 'label', 'description', 'class', 'disabled']);

  return (
    <div class={classNames(styles.wrapper, local.class)}>
      <button
        {...rest}
        class={classNames(styles.switch, local.checked && styles.checked)}
        type="button"
        role="switch"
        aria-checked={local.checked}
        disabled={local.disabled}
        onClick={() => local.onChange(!local.checked)}
      >
        <span class={styles.thumb} />
      </button>
      <LabelText label={local.label} description={local.description} />
    </div>
  );
};

export default Switch;
