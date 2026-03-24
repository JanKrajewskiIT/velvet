import { createContext, useContext } from 'solid-js';

interface DialogContextValue {
  titleId: string;
}

const DialogContext = createContext<DialogContextValue>();

const useDialogContext = () => useContext(DialogContext);

export { DialogContext, useDialogContext };
