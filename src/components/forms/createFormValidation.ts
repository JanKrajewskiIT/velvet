import { type Accessor, createSignal, createUniqueId, type Setter } from 'solid-js';

export interface FormValidation {
  invalid: Accessor<boolean>;
  setInvalid: Setter<boolean>;
  messageId: string;
  describedBy: (existing?: string) => string | undefined;
}

export const createFormValidation = (): FormValidation => {
  const [invalid, setInvalid] = createSignal(false);
  const messageId = `${createUniqueId()}-required`;
  const describedBy = (existing?: string) =>
    [existing, invalid() ? messageId : undefined].filter(Boolean).join(' ') || undefined;
  return { invalid, setInvalid, messageId, describedBy };
};
