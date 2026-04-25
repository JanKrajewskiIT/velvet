import { IoSearchOutline } from 'solid-icons/io';
import { createMemo, createSignal, onCleanup, onMount, splitProps } from 'solid-js';

import type { ButtonVariant } from '~/components/buttons/Button/Button';
import Button from '~/components/buttons/Button/Button';
import type { CommandItem } from '~/components/composites/CommandPalette/CommandPalette';
import CommandPalette from '~/components/composites/CommandPalette/CommandPalette';
import Kbd from '~/components/feedback/Kbd/Kbd';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CommandPaletteTrigger.module.css';

interface CommandPaletteTriggerProps {
  items: CommandItem[];
  label?: string;
  shortcutKey?: string;
  shortcutLabel?: string;
  variant?: ButtonVariant;
  size?: ComponentSize;
  children?: never;
}

const CommandPaletteTrigger = (props: Props<CommandPaletteTriggerProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'items',
    'label',
    'shortcutKey',
    'shortcutLabel',
    'variant',
    'size',
    'class',
  ]);
  const [open, setOpen] = createSignal(false);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/u.test(navigator.userAgent);
  const triggerLabel = createMemo(() => local.label ?? ts('common.search'));
  const normalizedShortcutKey = createMemo(() => (local.shortcutKey ?? 'k').toLowerCase());
  const resolvedShortcutLabel = createMemo(
    () => local.shortcutLabel ?? `${isMac ? 'Cmd' : 'Ctrl'}+${normalizedShortcutKey().toUpperCase()}`,
  );
  const resolvedVariant = createMemo<ButtonVariant>(() => local.variant ?? 'outline');
  const resolvedSize = createMemo<ComponentSize>(() => local.size ?? 'sm');

  const handleTriggerClick = () => setOpen(true);
  const handlePaletteClose = () => setOpen(false);

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== normalizedShortcutKey()) {
        return;
      }

      event.preventDefault();
      setOpen((current) => !current);
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <>
      <Button
        {...rest}
        aria-label={rest['aria-label'] ?? ts('commandPalette.open')}
        class={classNames(styles.root, local.class)}
        data-command-palette-variant={resolvedVariant()}
        onClick={handleTriggerClick}
        size={resolvedSize()}
        variant={resolvedVariant()}
      >
        <IoSearchOutline />
        <Text as="span" variant="bodySm" tone="inherit" class={styles.label}>
          {triggerLabel()}
        </Text>
        <Kbd class={styles.kbd}>{resolvedShortcutLabel()}</Kbd>
      </Button>
      <CommandPalette open={open()} onClose={handlePaletteClose} items={local.items} />
    </>
  );
};

export type { CommandPaletteTriggerProps };
export default CommandPaletteTrigger;
