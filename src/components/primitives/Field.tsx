import { createUniqueId, type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { FieldHint } from './FieldHint';
import { FieldLabel } from './FieldLabel';

/** Ids and state a Field hands to its control — spread onto the input. */
export interface FieldControlProps {
  id: string;
  invalid: boolean;
  describedBy?: string;
  required?: boolean;
}

export interface FieldProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  /** Replaces the hint and turns the control invalid. */
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  optionalLabel?: string;
  id?: string;
  /** Current length for the counter; shown when `maxCount` is set. */
  count?: number;
  maxCount?: number;
  /** Keep the hint lane height so validation messages do not shift layout. */
  reserveHint?: boolean;
  class?: string;
  children?: JSX.Element | ((control: FieldControlProps) => JSX.Element);
}

/** Label + control + hint/error stack with ids and aria wired. Pass a function child to receive the control props. */
export const Field = (props: FieldProps) => {
  const autoId = createUniqueId();
  const id = () => props.id ?? autoId;
  const hintId = () => `${id()}-hint`;
  const hasCounter = () => props.maxCount != null;
  const lane = () => props.reserveHint === true || hasCounter();
  const hasMessage = () => !!(props.error || props.hint);

  const control: FieldControlProps = {
    get id() {
      return id();
    },
    get invalid() {
      return !!props.error;
    },
    get describedBy() {
      return hasMessage() || hasCounter() ? hintId() : undefined;
    },
    get required() {
      return props.required;
    },
  };
  const renderer = () => (typeof props.children === 'function' ? props.children : undefined);
  const content = () => (typeof props.children === 'function' ? undefined : props.children);

  return (
    <div class={cx('vui-field', props.class)}>
      <Show when={props.label}>
        <FieldLabel
          id={`${id()}-label`}
          htmlFor={id()}
          optional={props.optional}
          required={props.required}
          optionalLabel={props.optionalLabel}
        >
          {props.label}
        </FieldLabel>
      </Show>
      <Show when={renderer()} keyed fallback={content()}>
        {(render) => render(control)}
      </Show>
      <Show when={hasMessage() || lane()}>
        <div class={cx('vui-field__foot', lane() && 'vui-hint--lane')}>
          <FieldHint id={hintId()} error={!!props.error} lane={lane()}>
            {props.error || props.hint}
          </FieldHint>
          <Show when={hasCounter()}>
            <span
              class={cx(
                'vui-hint',
                'vui-field__count',
                (props.count ?? 0) >= (props.maxCount ?? 0) && 'vui-field__count--max',
              )}
            >
              {props.count ?? 0}/{props.maxCount}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
