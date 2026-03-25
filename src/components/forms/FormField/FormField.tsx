import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import { joinAriaIds, resolveAriaErrorMessage, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './FormField.module.css';

interface FormFieldControlProps extends AriaFieldProps {
  id: string;
}

interface FormFieldOwnProps extends AriaFieldProps {
  label?: string;
  id?: string;
  children: JSX.Element | ((controlProps: FormFieldControlProps) => JSX.Element);
  description?: string;
  error?: string;
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
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'aria-errormessage',
  ]);

  const fieldId = () => local.id ?? generatedId;
  const labelId = () => `${fieldId()}-label`;
  const descriptionId = () => `${fieldId()}-description`;
  const errorId = () => `${fieldId()}-error`;
  const describedBy = () => {
    return joinAriaIds(local['aria-describedby'], local.description && descriptionId(), local.error && errorId());
  };

  const controlProps = (): FormFieldControlProps => ({
    id: fieldId(),
    'aria-labelledby': joinAriaIds(local['aria-labelledby'], local.label && labelId()),
    'aria-describedby': describedBy(),
    'aria-invalid': resolveAriaInvalid(local.invalid, local['aria-invalid']),
    'aria-errormessage': resolveAriaErrorMessage(describedBy(), local['aria-errormessage'], local.error && errorId()),
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
      aria-labelledby={joinAriaIds(local['aria-labelledby'], local.label && labelId())}
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
