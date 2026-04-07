import { createMemo, createSignal, createUniqueId, onCleanup, onMount, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import { useAccordionContext } from '~/components/surfaces/Accordion/AccordionContext';
import AccordionIcon from '~/components/surfaces/Accordion/AccordionIcon/AccordionIcon';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './AccordionItem.module.css';

interface AccordionItemOwnProps extends Omit<DivCoreNativeProps, 'onToggle'> {
  label: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const AccordionItem = (props: Props<AccordionItemOwnProps>) => {
  const { ts } = useI18n();
  const accordion = useAccordionContext();
  const [local, rest] = splitProps(props, [
    'label',
    'children',
    'isOpen',
    'defaultOpen',
    'onToggle',
    'disabled',
    'class',
  ]);
  const itemId = createUniqueId();
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false);

  const isOpen = createMemo(() => (local.isOpen !== undefined ? local.isOpen : internalOpen()));
  const ariaLabel = createMemo(() => {
    if (local.label.trim().length > 0) {
      return ts('accordion.toggleSectionWithLabel', { label: local.label });
    }
    return ts('accordion.toggleSection');
  });

  const handleToggle = () => {
    if (local.disabled) return;
    const nextState = !isOpen();
    if (nextState) accordion?.requestOpen(itemId);
    if (local.isOpen === undefined) setInternalOpen(nextState);
    local.onToggle?.(nextState);
  };

  onMount(() => {
    accordion?.registerItem(itemId, {
      isOpen,
      setOpen: (nextState, options) => {
        if (isOpen() === nextState) return;
        if (local.isOpen === undefined) setInternalOpen(nextState);
        if (options?.notify) local.onToggle?.(nextState);
      },
    });
  });

  onCleanup(() => {
    accordion?.unregisterItem(itemId);
  });

  return (
    <div
      class={classNames(styles.item, isOpen() && styles.itemExpanded, local.disabled && styles.disabled, local.class)}
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
        <Text as="span" variant="labelLg" tone="inherit">
          {local.label}
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
