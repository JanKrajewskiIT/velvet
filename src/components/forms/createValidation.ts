import { type Accessor, createMemo, createSignal } from 'solid-js';

/** Returns an error message, or nothing when the value is valid. */
export type Validator = (value: string) => string | undefined | null | false;

export interface Validation {
  /** Current validation message. */
  message: Accessor<string | undefined>;
  /** Validates on blur and marks the field touched. */
  blur: () => void;
}

/** Blur-then-live validation shared by the text fields. */
export const createValidation = (validate: Accessor<Validator | undefined>, value: Accessor<string>): Validation => {
  const [touched, setTouched] = createSignal(false);
  const message = createMemo(() => (touched() ? validate()?.(value()) || undefined : undefined));
  return {
    message,
    blur: () => {
      if (validate()) setTouched(true);
    },
  };
};
