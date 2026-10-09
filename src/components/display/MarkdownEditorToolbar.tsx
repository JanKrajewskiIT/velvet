import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Glyph } from '../primitives/Glyph';
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
      class="vui-mde__tools"
      role="toolbar"
      aria-label={translate('velvet.display.markdownEditor.toolbarLabel')}
      aria-controls={props.fieldId}
    >
      <For each={MARKDOWN_TOOLBAR}>
        {(item) => (
          <Show when={item.kind !== 'separator' && item} fallback={<span class="vui-mde__sep" aria-hidden="true" />}>
            {(tool) => (
              <button
                type="button"
                class="vui-mde__tool"
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
                    <span class="vui-mde__glyph" aria-hidden="true">
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
