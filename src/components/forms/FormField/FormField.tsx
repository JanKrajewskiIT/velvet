import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './FormField.module.css';

interface FormFieldControlProps {
  id: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

interface FormFieldOwnProps {
  label?: JSX.Element;
  id?: string;
  children: JSX.Element | ((controlProps: FormFieldControlProps) => JSX.Element);
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
  const labelId = () => `${fieldId()}-label`;
  const descriptionId = () => `${fieldId()}-description`;
  const errorId = () => `${fieldId()}-error`;
  const describedBy = () => {
    const ids = [local.description && descriptionId(), local.error && errorId()].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  const controlProps = (): FormFieldControlProps => ({
    id: fieldId(),
    'aria-labelledby': local.label ? labelId() : undefined,
    'aria-describedby': describedBy(),
    'aria-invalid': local.invalid ? true : undefined,
  });

  const content = () => {
    if (typeof local.children === 'function') {
      return local.children(controlProps());
    }

    return local.children;
  };

  return (
    <div
      class={classNames(styles.field, local.class)}
      role="group"
      aria-labelledby={local.label ? labelId() : undefined}
      aria-describedby={describedBy()}
      data-invalid={local.invalid || undefined}
    >
      <Show when={local.label}>
        <label class={classNames(styles.label, local.invalid && styles.labelInvalid)} for={fieldId()} id={labelId()}>
          <Text as="span" variant="labelMd" tone="muted">
            {local.label}
          </Text>
          <Show when={local.required}>
            <Text as="span" variant="labelMd" tone="primary" class={styles.required} aria-hidden="true">
              *
            </Text>
          </Show>
        </label>
      </Show>
      {content()}
      <Show when={local.description}>
        <Text as="p" variant="caption" tone="muted" id={descriptionId()}>
          {local.description}
        </Text>
      </Show>
      <Show when={local.error}>
        <Text as="p" variant="caption" tone="primary" class={styles.error} id={errorId()} role="alert">
          {local.error}
        </Text>
      </Show>
    </div>
  );
};

export type { FormFieldControlProps, FormFieldOwnProps as FormFieldProps };
export default FormField;
