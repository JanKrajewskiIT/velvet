import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  id?: string;
  children: JSX.Element;
}

const FormField = (props: Props<FormFieldProps>) => {
  return (
    <div class={`${styles.field} ${props.class ?? ''}`}>
      <label class={styles.label} for={props.id}>
        {props.label}
      </label>
      {props.children}
    </div>
  );
};

export default FormField;
