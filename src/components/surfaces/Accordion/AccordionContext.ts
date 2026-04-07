import type { Accessor } from 'solid-js';
import { createContext, useContext } from 'solid-js';

interface AccordionItemRegistration {
  isOpen: Accessor<boolean>;
  setOpen: (isOpen: boolean, options?: AccordionItemSetOpenOptions) => void;
}

interface AccordionItemSetOpenOptions {
  notify?: boolean;
}

interface AccordionContextValue {
  multiple: Accessor<boolean>;
  registerItem: (id: string, item: AccordionItemRegistration) => void;
  unregisterItem: (id: string) => void;
  requestOpen: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>();

const useAccordionContext = () => useContext(AccordionContext);

export { AccordionContext, useAccordionContext };
export type { AccordionContextValue, AccordionItemRegistration, AccordionItemSetOpenOptions };
