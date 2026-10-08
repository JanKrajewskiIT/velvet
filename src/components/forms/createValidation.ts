import { type Accessor, createSignal } from 'solid-js';

/** Returns an error message, or nothing when the value is valid. */
export type Validator = (value: string) => string | undefined | null | false;

export interface Validation {
  /** Current validation message. */
  message: Accessor<string | undefined>;
  /** Validates on blur and marks the field touched. */
  blur: (value: string) => void;
  /** Re-validates on every change once the field was touched. */
  input: (value: string) => void;
}

/** Blur-then-live validation shared by the text fields. */
export const createValidation = (validate: Accessor<Validator | undefined>): Validation => {
  const [touched, setTouched] = createSignal(false);
  const [message, setMessage] = createSignal<string | undefined>();
  const run = (validator: Validator, value: string) => setMessage(validator(value) || undefined);
  return {
    message,
    blur: (value) => {
      const validator = validate();
      if (!validator) return;
      setTouched(true);
      run(validator, value);
    },
    input: (value) => {
      const validator = validate();
      if (validator && touched()) run(validator, value);
    },
  };
};
