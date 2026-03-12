import { FiChevronDown } from 'solid-icons/fi';
import { createMemo, createSignal, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Accordion.module.css';

interface AccordionItemOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  title: string | JSX.Element;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'card';
}

const AccordionItem = (props: Props<AccordionItemOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'title',
    'children',
    'isOpen',
    'defaultOpen',
    'onToggle',
    'disabled',
    'variant',
    'class',
  ]);
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false);

  const isOpen = createMemo(() => (local.isOpen !== undefined ? local.isOpen : internalOpen()));

  const handleToggle = () => {
    if (local.disabled) return;
    const nextState = !isOpen();
    if (local.isOpen === undefined) setInternalOpen(nextState);
    local.onToggle?.(nextState);
  };

  return (
    <div
      class={`${styles.accordionItem} ${local.variant === 'card' ? styles.cardVariant : ''} ${isOpen() ? styles.open : ''} ${local.disabled ? styles.disabled : ''} ${local.class ?? ''}`}
      {...rest}
    >
      <button class={styles.header} onClick={handleToggle} disabled={local.disabled}>
        <div class={styles.title}>{local.title}</div>
        <div class={`${styles.icon} ${isOpen() ? styles.iconOpen : ''}`}>
          <FiChevronDown />
        </div>
      </button>
      <div class={`${styles.content} ${isOpen() ? styles.contentOpen : ''}`}>
        <div class={styles.contentInner}>{local.children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
