import { createMemo, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import { joinAriaIds, resolveAriaErrorMessage, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import LabelText from '../../typography/LabelText/LabelText';
import Text from '../../typography/Text/Text';
import styles from './FormField.module.css';

interface FormFieldControlProps extends AriaFieldProps {
  id: string;
}

interface FormFieldOwnProps extends Omit<DivCoreNativeProps, 'children'>, AriaFieldProps {
  label?: string;
  id?: string;
  children: JSX.Element | ((controlProps: FormFieldControlProps) => JSX.Element);
  description?: string;
  error?: string;
  required?: boolean;
  invalid?: boolean;
}

const FormField = (props: Props<FormFieldOwnProps>) => {
  const [local, rest] = splitProps(props, [
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
  const generatedId = createUniqueId();

  const fieldId = createMemo(() => local.id ?? generatedId);
  const labelId = createMemo(() => (local.label ? `${fieldId()}-label` : undefined));
  const descriptionId = createMemo(() => (local.description ? `${fieldId()}-description` : undefined));
  const errorId = createMemo(() => (local.error ? `${fieldId()}-error` : undefined));
  const describedBy = createMemo(() => joinAriaIds(local['aria-describedby'], descriptionId(), errorId()));
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], labelId()));
  const ariaInvalid = createMemo(() => resolveAriaInvalid(local.invalid, local['aria-invalid']));
  const ariaErrorMessage = createMemo(() =>
    resolveAriaErrorMessage(describedBy(), local['aria-errormessage'], errorId()),
  );

  const controlProps = createMemo<FormFieldControlProps>(() => ({
    id: fieldId(),
    'aria-labelledby': labelledBy(),
    'aria-describedby': describedBy(),
    'aria-invalid': ariaInvalid(),
    'aria-errormessage': ariaErrorMessage(),
  }));

  const content = createMemo(() => {
    if (typeof local.children === 'function') {
      return local.children(controlProps());
    }

    return local.children;
  });

  return (
    <div
      {...rest}
      class={classNames(styles.field, local.class)}
      role={rest.role ?? 'group'}
      aria-labelledby={labelledBy()}
      aria-describedby={describedBy()}
      data-invalid={local.invalid || undefined}
    >
      <Show when={local.label}>
        <div class={classNames(styles.label, local.invalid && styles.labelInvalid)} id={labelId()}>
          <LabelText label={local.label} class={styles.labelText} />
          <Show when={local.required}>
            <Text as="span" variant="labelMd" tone="inherit" class={styles.required} aria-hidden="true">
              *
            </Text>
          </Show>
        </div>
      </Show>
      {content()}
      <Show when={local.description || local.error}>
        <div class={styles.meta}>
          <Show when={local.description}>
            <Text as="p" variant="caption" tone="inherit" class={styles.description} id={descriptionId()}>
              {local.description}
            </Text>
          </Show>
          <Show when={local.error}>
            <Text as="p" variant="caption" tone="inherit" class={styles.error} id={errorId()} role="alert">
              {local.error}
            </Text>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export type { FormFieldControlProps, FormFieldOwnProps as FormFieldProps };
export default FormField;
