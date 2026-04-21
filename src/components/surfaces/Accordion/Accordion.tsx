import { createEffect, createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Accordion.module.css';
import {
  AccordionContext,
  type AccordionContextValue,
  type AccordionItemRegistration,
  type AccordionItemSetOpenOptions,
} from './AccordionContext';

export interface AccordionOwnProps extends DivCoreNativeProps {
  multiple?: boolean;
  gap?: 'sm' | 'md' | 'lg';
}

const gapClassByValue: Record<NonNullable<AccordionOwnProps['gap']>, string | undefined> = {
  sm: styles.gapSm,
  md: undefined,
  lg: styles.gapLg,
};

const Accordion = (props: Props<AccordionOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'multiple', 'gap']);
  const items = new Map<string, AccordionItemRegistration>();
  const multiple = createMemo(() => local.multiple ?? false);

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

      item.setOpen(false, { notify: true });
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
      <div class={classNames(styles.root, gapClassByValue[local.gap ?? 'md'], local.class)} {...rest}>
        {local.children}
      </div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
