import { createEffect, createMemo, createSignal, For, on, onCleanup, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { FormValidation } from './createFormValidation';

export interface FormValueProps {
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  invalidMessage?: string;
  value: string | readonly string[];
  validation: FormValidation;
  onReset: () => void;
  focusInvalid: () => void;
}

/** Nameless validation proxy keeps native form validity separate from submitted values. */
export const FormValue = (props: FormValueProps) => {
  const translate = useTranslate();
  const [proxy, setProxy] = createSignal<HTMLInputElement>();
  const values = createMemo(() => (typeof props.value === 'string' ? [props.value] : props.value));
  const present = () => values().some((value) => value !== '');
  const validationValue = () => (present() ? 'valid' : '');
  createEffect(() => {
    proxy()?.setCustomValidity(props.invalidMessage ?? '');
    if (props.disabled || (!props.invalidMessage && (present() || !props.required))) props.validation.setInvalid(false);
  });
  createEffect(
    on([() => props.form, proxy], ([, initialInput]) => {
      if (!initialInput) return;
      const initialForm = initialInput.form;
      if (!initialForm) return;
      let disposed = false;
      const reset = (event: Event) =>
        queueMicrotask(() =>
          untrack(() => {
            if (!disposed && !event.defaultPrevented && initialInput.isConnected) {
              props.validation.setInvalid(false);
              props.onReset();
            }
          }),
        );
      initialForm.addEventListener('reset', reset);
      onCleanup(() => {
        disposed = true;
        initialForm.removeEventListener('reset', reset);
      });
    }),
  );
  return (
    <>
      <input
        ref={setProxy}
        class="vui-form-value"
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        form={props.form}
        required={props.required}
        disabled={props.disabled}
        value={validationValue()}
        autocomplete="off"
        onInvalid={(event) => {
          event.preventDefault();
          props.validation.setInvalid(true);
          props.focusInvalid();
        }}
      />
      <For each={props.name ? values() : []}>
        {(value) => (
          <input
            ref={(element) => {
              element.defaultValue = value;
            }}
            type="hidden"
            name={props.name}
            form={props.form}
            disabled={props.disabled}
            value={value}
          />
        )}
      </For>
      <Show when={props.validation.invalid()}>
        <span id={props.validation.messageId} class="vui-hint vui-hint--error" role="alert">
          {props.invalidMessage ?? translate('velvet.forms.formValue.required')}
        </span>
      </Show>
    </>
  );
};
