import { createUniqueId, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import LabelText from '../shared/LabelText';
import styles from './Checkbox.module.css';

interface CheckboxOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: JSX.Element;
  description?: JSX.Element;
}

const Checkbox = (props: Props<CheckboxOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, ['label', 'description', 'class', 'id']);

  const inputId = () => local.id ?? generatedId;

  return (
    <label class={`${styles.wrapper} ${local.class ?? ''}`} for={inputId()}>
      <span class={styles.control}>
        <input {...rest} id={inputId()} type="checkbox" class={styles.input} />
        <span class={styles.indicator} aria-hidden="true" />
      </span>
      <LabelText label={local.label} description={local.description} />
    </label>
  );
};

export default Checkbox;
