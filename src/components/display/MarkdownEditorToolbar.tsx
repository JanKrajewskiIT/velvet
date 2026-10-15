import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Glyph } from '../primitives/Glyph';
import styles from './MarkdownEditorToolbar.module.css';
import { MARKDOWN_TOOLBAR, type MarkdownTool } from './markdownTools';

export interface MarkdownEditorToolbarProps {
  fieldId: string;
  modifierLabel: string;
  disabled?: boolean;
  onTool: (tool: MarkdownTool) => void;
}

export const MarkdownEditorToolbar = (props: MarkdownEditorToolbarProps) => {
  const translate = useTranslate();

  return (
    <div
      class={styles.mdePartTools}
      role="toolbar"
      aria-label={translate('velvet.display.markdownEditor.toolbarLabel')}
      aria-controls={props.fieldId}
    >
      <For each={MARKDOWN_TOOLBAR}>
        {(item) => (
          <Show
            when={item.kind !== 'separator' && item}
            fallback={<span class={styles.mdePartSep} aria-hidden="true" />}
          >
            {(tool) => (
              <button
                type="button"
                class={styles.mdePartTool}
                disabled={props.disabled}
                title={
                  tool().shortcut
                    ? `${translate(tool().labelKey)} (${props.modifierLabel}${tool().shortcut?.toUpperCase()})`
                    : translate(tool().labelKey)
                }
                aria-label={translate(tool().labelKey)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => props.onTool(tool())}
              >
                <Show
                  when={tool().icon}
                  fallback={
                    <span class={styles.mdePartGlyph} aria-hidden="true">
                      {tool().glyph}
                    </span>
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
