import { createMemo, createSignal, createUniqueId, onCleanup, onMount, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Card from '~/components/surfaces/Card/Card';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import { useAccordionContext } from '../AccordionContext';
import AccordionIcon from '../AccordionIcon/AccordionIcon';
import styles from './AccordionItem.module.css';

type AccordionTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface AccordionItemOwnProps extends Omit<DivCoreNativeProps, 'onToggle'> {
  label: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
  tone?: AccordionTone;
  animationOrder?: number;
}

const AccordionItem = (props: Props<AccordionItemOwnProps>) => {
  const accordion = useAccordionContext();
  const [local, rest] = splitProps(props, [
    'label',
    'children',
    'isOpen',
    'defaultOpen',
    'onToggle',
    'disabled',
    'tone',
    'animationOrder',
    'class',
    'style',
  ]);
  const itemId = createUniqueId();
  const contentId = `${itemId}-content`;
  const triggerId = `${itemId}-trigger`;
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false);

  const isOpen = createMemo(() => (local.isOpen !== undefined ? local.isOpen : internalOpen()));

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
    <Card
      padding="none"
      radius="lg"
      clip
      class={classNames(styles.item, local.disabled && styles.disabled, local.class)}
      data-open={isOpen()}
      data-tone={local.tone ?? 'default'}
      style={{ ...local.style, '--accordion-animation-order': local.animationOrder ?? 0 }}
      {...rest}
    >
      <Button
        type="button"
        variant="subtle"
        size="lg"
        class={styles.trigger}
        onClick={handleToggle}
        disabled={local.disabled}
        aria-expanded={isOpen()}
        aria-controls={contentId}
        id={triggerId}
      >
        <span class={styles.headerContent}>
          <Text as="span" variant="labelLg" class={styles.label}>
            {local.label}
          </Text>
          <AccordionIcon isOpen={isOpen()} class={styles.icon} />
        </span>
      </Button>

      <div
        class={classNames(styles.expandWrapper, isOpen() && styles.expandWrapperOpen)}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
      >
        <div class={styles.expandInner}>
          <div class={styles.separator} />
          <div class={styles.body}>{local.children}</div>
        </div>
      </div>
    </Card>
  );
};

export type { AccordionItemOwnProps, AccordionTone };
export default AccordionItem;
