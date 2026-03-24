import { createMemo, createSignal, type JSX, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import AccordionIcon from '~/components/surfaces/AccordionIcon/AccordionIcon';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './AccordionItem.module.css';

interface AccordionItemOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  title: JSX.Element;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const AccordionItem = (props: Props<AccordionItemOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'title',
    'children',
    'isOpen',
    'defaultOpen',
    'onToggle',
    'disabled',
    'class',
  ]);
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false);

  const isOpen = createMemo(() => (local.isOpen !== undefined ? local.isOpen : internalOpen()));
  const ariaLabel = createMemo(() => {
    if (typeof local.title === 'string' && local.title.trim().length > 0) {
      return `Toggle ${local.title} section`;
    }

    return 'Toggle section';
  });

  const handleToggle = () => {
    if (local.disabled) return;
    const nextState = !isOpen();
    if (local.isOpen === undefined) setInternalOpen(nextState);
    local.onToggle?.(nextState);
  };

  return (
    <div
      class={classNames(styles.item, isOpen() && styles.open, local.disabled && styles.disabled, local.class)}
      {...rest}
    >
      <Button
        type="button"
        class={styles.header}
        onClick={handleToggle}
        disabled={local.disabled}
        variant="subtle"
        size="md"
        aria-label={ariaLabel()}
      >
        <Text as="span" variant="labelLg" tone="secondary">
          {local.title}
        </Text>
        <AccordionIcon isOpen={isOpen()} class={styles.icon} />
      </Button>
      <div class={classNames(styles.content, isOpen() && styles.contentOpen)}>
        <div class={styles.contentInner}>{local.children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
