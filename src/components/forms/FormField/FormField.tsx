import type { JSX } from 'solid-js';

import type Props from '~/models/Props';

import Text from '../../typography/Text/Text';
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
        <Text as="span" variant="labelMd" tone="muted">
          {props.label}
        </Text>
      </label>
      {props.children}
    </div>
  );
};

export default FormField;
