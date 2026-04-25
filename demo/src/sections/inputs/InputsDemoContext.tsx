import { createContext, type ParentProps, useContext } from 'solid-js';

import type { InputsDemoModel } from './inputsTypes';

const InputsDemoContext = createContext<InputsDemoModel>();

export const InputsDemoProvider = (props: ParentProps<{ value: InputsDemoModel }>) => (
  // Model is a stable snapshot of signals; we do not react to `value` prop updates.
  // eslint-disable-next-line solid/reactivity -- context value is intentionally static
  <InputsDemoContext.Provider value={props.value}>{props.children}</InputsDemoContext.Provider>
);

export const useInputsDemo = (): InputsDemoModel => {
  const ctx = useContext(InputsDemoContext);
  if (!ctx) {
    throw new Error('useInputsDemo must be used within InputsDemoProvider');
  }
  return ctx;
};
