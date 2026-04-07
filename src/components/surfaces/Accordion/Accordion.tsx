import { createEffect, createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';

import Card from '../Card/Card';
import {
  AccordionContext,
  type AccordionContextValue,
  type AccordionItemRegistration,
  type AccordionItemSetOpenOptions,
} from './AccordionContext';

export interface AccordionOwnProps extends DivCoreNativeProps {
  multiple?: boolean;
}

const Accordion = (props: Props<AccordionOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'multiple']);
  const items = new Map<string, AccordionItemRegistration>();
  const multiple = createMemo(() => local.multiple ?? true);

  const closeOtherItems = (activeId: string, options?: AccordionItemSetOpenOptions) => {
    items.forEach((item, id) => {
      if (id !== activeId && item.isOpen()) item.setOpen(false, options);
    });
  };

  const enforceSingleOpenItem = () => {
    if (multiple()) return;

    let openItemId: string | undefined;
    items.forEach((item, id) => {
      if (!item.isOpen()) return;
      if (openItemId === undefined) {
        openItemId = id;
        return;
      }
      item.setOpen(false);
    });
  };

  const contextValue: AccordionContextValue = {
    multiple,
    registerItem: (id, item) => {
      items.set(id, item);
      if (!multiple() && item.isOpen()) closeOtherItems(id);
    },
    unregisterItem: (id) => {
      items.delete(id);
    },
    requestOpen: (id) => {
      if (!multiple()) closeOtherItems(id, { notify: true });
    },
  };

  createEffect(enforceSingleOpenItem);

  return (
    <AccordionContext.Provider value={contextValue}>
      <Card padding="none" radius="md" clip class={local.class} {...rest}>
        {local.children}
      </Card>
    </AccordionContext.Provider>
  );
};

export default Accordion;
