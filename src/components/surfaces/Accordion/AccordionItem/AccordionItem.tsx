import { createMemo, createSignal, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
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
  const [local, rest] = splitProps(props, [
    'label',
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
    if (local.label.trim().length > 0) {
      return ts('accordion.toggleSectionWithLabel', { label: local.label });
    }
    return ts('accordion.toggleSection');
  });

  const handleToggle = () => {
    if (local.disabled) return;
    const nextState = !isOpen();
    if (local.isOpen === undefined) setInternalOpen(nextState);
    local.onToggle?.(nextState);
  };

  return (
    <div class={classNames(styles.item, local.disabled && styles.disabled, local.class)} {...rest}>
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
