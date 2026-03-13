import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './FormField.module.css';

interface FormFieldOwnProps {
  label?: JSX.Element;
  id?: string;
  children: JSX.Element;
  description?: JSX.Element;
  error?: JSX.Element;
  required?: boolean;
  invalid?: boolean;
}

const FormField = (props: Props<FormFieldOwnProps>) => {
  const generatedId = createUniqueId();
  const [local] = splitProps(props, [
    'class',
    'label',
    'id',
    'children',
    'description',
    'error',
    'required',
    'invalid',
  ]);

  const fieldId = () => local.id ?? generatedId;

  return (
    <div class={classNames(styles.field, local.class)}>
      <Show when={local.label}>
        <label class={styles.label} for={fieldId()}>
          <Text as="span" variant="labelMd" tone={local.invalid ? 'default' : 'muted'}>
            {local.label}
          </Text>
          <Show when={local.required}>
            <Text as="span" variant="labelMd" class={styles.required} aria-hidden="true">
              *
            </Text>
          </Show>
        </label>
      </Show>
      {local.children}
      <Show when={local.description}>
        <Text as="p" variant="caption" tone="muted" class={styles.description}>
          {local.description}
        </Text>
      </Show>
      <Show when={local.error}>
        <Text as="p" variant="caption" class={styles.error}>
          {local.error}
        </Text>
      </Show>
    </div>
  );
};

export type { FormFieldOwnProps as FormFieldProps };
export default FormField;
