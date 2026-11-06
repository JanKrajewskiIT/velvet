import { createUniqueId, type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { joinIdRefs } from '../../utils/joinIdRefs';
import styles from './Field.module.css';
import type { FieldErrorAnnouncementProps } from './fieldErrorAnnouncement';
import { FieldFeedback } from './FieldFeedback';
import { FieldLabel } from './FieldLabel';
import { Text } from './Text';

/** Ids and state a Field hands to its control — spread onto the input. */
export interface FieldControlProps {
  id: string;
  invalid: boolean;
  describedBy?: string;
  required?: boolean;
}

export interface FieldProps extends FieldErrorAnnouncementProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  /** Replaces the hint, turns the control invalid and is announced politely unless speech is delegated. */
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
  const errorId = () => `${id()}-error`;
  const countId = () => `${id()}-count`;
  const hasCounter = () => props.maxCount != null;
  const lane = () => props.reserveHint === true || hasCounter();

  const control: FieldControlProps = {
    get id() {
      return id();
    },
    get invalid() {
      return !!props.error;
    },
    get describedBy() {
      return joinIdRefs(
        props.error ? errorId() : props.hint ? hintId() : undefined,
        hasCounter() ? countId() : undefined,
      );
    },
    get required() {
      return props.required;
    },
  };
  const renderer = () => (typeof props.children === 'function' ? props.children : undefined);
  const content = () => (typeof props.children === 'function' ? undefined : props.children);

  return (
    <div class={cx(styles.field, props.class)}>
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
      <FieldFeedback
        hintId={hintId()}
        errorId={errorId()}
        hint={props.hint}
        error={props.error}
        reserveSpace={lane()}
        data-field-error-announcement={props['data-field-error-announcement']}
      >
        <Show when={hasCounter()}>
          <Text
            as="span"
            id={countId()}
            variant="kbd"
            tone="inherit"
            class={cx(
              styles.hint,
              styles.fieldPartCount,
              (props.count ?? 0) >= (props.maxCount ?? 0) && styles.fieldPartCountVariantMax,
            )}
          >
            {props.count ?? 0}/{props.maxCount}
          </Text>
        </Show>
      </FieldFeedback>
    </div>
  );
};
