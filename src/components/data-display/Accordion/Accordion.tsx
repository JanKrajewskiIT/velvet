import { FiChevronDown } from 'solid-icons/fi';
import { createMemo, createSignal, type JSX, splitProps } from 'solid-js';

import styles from './Accordion.module.css';

export type AccordionProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Accordion = (props: AccordionProps) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={`${styles.accordion} ${local.class || ''}`} {...rest}>
      {local.children}
    </div>
  );
};

export interface AccordionItemProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'title' | 'onToggle'
> {
  title: string | JSX.Element;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

export const AccordionItem = (props: AccordionItemProps) => {
  const [local, rest] = splitProps(props, [
    'title',
    'children',
    'isOpen',
    'onToggle',
    'disabled',
    'class',
  ]);
  const [internalOpen, setInternalOpen] = createSignal(false);

  const isOpen = createMemo(() =>
    local.isOpen !== undefined ? local.isOpen : internalOpen()
  );

  const handleToggle = () => {
    if (local.disabled) return;
    const nextState = !isOpen();
    if (local.isOpen === undefined) setInternalOpen(nextState);
    local.onToggle?.(nextState);
  };

  return (
    <div
      class={`${styles.accordionItem} ${isOpen() ? styles.open : ''} ${local.disabled ? styles.disabled : ''} ${local.class || ''}`}
      {...rest}
    >
      <button
        class={styles.header}
        onClick={handleToggle}
        disabled={local.disabled}
      >
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
