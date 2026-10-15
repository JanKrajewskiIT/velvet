import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { MarkName } from './richTextModel';
import styles from './RichTextToolbar.module.css';
import {
  ariaShortcut,
  formatShortcut,
  isToolButton,
  type ToolbarEntry,
  type ToolButton,
  type ToolId,
} from './richTextTools';

export interface RichTextFormat {
  marks: ReadonlySet<MarkName>;
  /** Tag name of the block under the caret. */
  block: string;
  /** `UL` or `OL` when the caret is in a list item. */
  list: string | null;
  link: boolean;
}

export const EMPTY_FORMAT: RichTextFormat = { marks: new Set(), block: 'P', list: null, link: false };

export interface RichTextToolbarProps {
  entries: ReadonlyArray<ToolbarEntry>;
  format: RichTextFormat;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
  label: string;
  /** Id of the editable area the toolbar controls. */
  controls: string;
  toolLabel: (id: ToolId) => string;
  onTool: (id: ToolId) => void;
}

const isPressed = (tool: ToolButton, format: RichTextFormat): boolean => {
  switch (tool.id) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
      return format.marks.has(tool.id);
    case 'UL':
    case 'OL':
      return format.list === tool.id;
    case 'link':
      return format.link;
    case 'H2':
    case 'H3':
    case 'BLOCKQUOTE':
    case 'PRE':
      return format.block === tool.id;
    case 'undo':
    case 'redo':
      return false;
  }
};

/** Formatting toolbar with a roving tabindex (←→ Home End). Buttons keep the editor's selection by cancelling `mousedown`. */
export const RichTextToolbar = (props: RichTextToolbarProps) => {
  const [roving, setRoving] = createSignal(0);
  const buttons = createMemo(() => props.entries.filter(isToolButton));

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    const count = buttons().length;
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (roving() + 1) % count;
    else if (event.key === 'ArrowLeft') next = (roving() - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    if (next === undefined) return;
    event.preventDefault();
    setRoving(next);
    event.currentTarget.querySelectorAll('button')[next]?.focus();
  };

  const isDisabled = (tool: ToolButton) =>
    props.disabled || (tool.id === 'undo' && !props.canUndo) || (tool.id === 'redo' && !props.canRedo);

  return (
    <div
      role="toolbar"
      aria-label={props.label}
      aria-controls={props.controls}
      class={styles.rtePartBar}
      onKeyDown={onKeyDown}
    >
      <For each={props.entries}>
        {(entry) => (
          <Show
            when={entry.kind === 'button' ? entry : undefined}
            fallback={
              <span
                class={entry.kind === 'spacer' ? styles.rtePartSpacer : styles.toolbarPartSep}
                role={entry.kind === 'separator' ? 'separator' : undefined}
              />
            }
          >
            {(tool) => (
              <button
                type="button"
                tabIndex={buttons().indexOf(tool()) === roving() ? 0 : -1}
                class={cx(typographyClass('label'), styles.toolbarPartBtn, tool().flip && styles.rtePartFlip)}
                aria-label={props.toolLabel(tool().id)}
                title={`${props.toolLabel(tool().id)} (${formatShortcut(tool().keys)})`}
                aria-pressed={
                  tool().id === 'undo' || tool().id === 'redo' ? undefined : isPressed(tool(), props.format)
                }
                aria-keyshortcuts={ariaShortcut(tool().keys)}
                disabled={isDisabled(tool())}
                onMouseDown={(event) => event.preventDefault()}
                onFocus={() => setRoving(buttons().indexOf(tool()))}
                onClick={() => props.onTool(tool().id)}
              >
                <Show
                  when={tool().icon}
                  fallback={
                    <Text as="span" variant="label-sm" tone="inherit" class="vui-rte__tt" aria-hidden="true">
                      {tool().text}
                    </Text>
                  }
                >
                  {(icon) => <Glyph name={icon()} />}
                </Show>
              </button>
            )}
          </Show>
        )}
      </For>
    </div>
  );
};
