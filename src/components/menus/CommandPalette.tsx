import { type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { cx } from '../../utils/cx';
import styles from './CommandPalette.module.css';
import { CommandPaletteDialog } from './CommandPaletteDialog';
import type { CommandGroup, CommandPaletteLabels } from './commandSearch';

export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  groups: CommandGroup[];
  /** @default localized "Type a command or search…" */
  placeholder?: string;
  /** @default localized "No results." */
  emptyText?: string;
  /** Dialog name and footer hint texts. Defaults are localized. */
  labels?: Partial<CommandPaletteLabels>;
  class?: string;
}

/** ⌘K palette: fuzzy-filtered, grouped results with match highlight; ↑↓ Enter Esc. Pair with SearchTrigger (it owns the ⌘K hotkey). */
export const CommandPalette = (props: CommandPaletteProps): JSX.Element => (
  <Show when={props.open}>
    <Portal>
      <CommandPaletteDialog
        groups={props.groups}
        onClose={() => props.onClose?.()}
        placeholder={props.placeholder}
        emptyText={props.emptyText}
        labels={props.labels}
        class={cx(styles.root, props.class)}
      />
    </Portal>
  </Show>
);
