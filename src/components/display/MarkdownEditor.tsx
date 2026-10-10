import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { FieldHint } from '../primitives/FieldHint';
import { FieldLabel } from '../primitives/FieldLabel';
import { createMarkdownEditor } from './createMarkdownEditor';
import { createModifierLabel } from './createModifierLabel';
import { Markdown } from './Markdown';
import type { MarkdownEditorMode } from './markdownEditorModes';
import { MarkdownEditorTabs } from './MarkdownEditorTabs';
import { MarkdownEditorToolbar } from './MarkdownEditorToolbar';

export type { MarkdownEditorMode };

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as `onChange` (`onChange` stays as an alias). */
  onValueChange?: (value: string) => void;
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  /** @default localized "Write in Markdown…" */
  placeholder?: string;
  /** Controlled view. */
  mode?: MarkdownEditorMode;
  /** Collapses to stacked panes under 640px. @default 'split' */
  defaultMode?: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  /** Pane height. @default 280 */
  height?: number | string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  /** @default true */
  toolbar?: boolean;
  /** @default localized "Nothing to preview yet." */
  previewEmpty?: JSX.Element;
  id?: string;
  class?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
}

const formatHeight = (height: number | string): string => (typeof height === 'number' ? `${height}px` : height);

/**
 * Markdown authoring field — Write · Split · Preview tabs, formatting toolbar, shortcut keys,
 * Enter continues lists (an empty item ends the list), Tab / Shift+Tab indents list items. The preview IS `Markdown`:
 * same renderer, same sanitising, so what you write is what readers see.
 */
export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const merged = mergeProps(
    { defaultValue: '', defaultMode: 'split', height: 280, toolbar: true } satisfies MarkdownEditorProps,
    props,
  );
  const translate = useTranslate();
  const placeholder = () => merged.placeholder ?? translate('velvet.display.markdownEditor.placeholder');
  const previewEmpty = () => merged.previewEmpty ?? translate('velvet.display.markdownEditor.previewEmpty');
  const autoId = createUniqueId();
  const fieldId = () => merged.id ?? autoId;
  const footId = () => `${fieldId()}-foot`;
  const modifierLabel = createModifierLabel();
  const editor = createMarkdownEditor(merged);
  const hasMessage = () => !!(merged.error || merged.hint);

  return (
    <div class={cx('vui-field', 'vui-mde-field', merged.class)}>
      <Show when={merged.label}>
        <FieldLabel htmlFor={fieldId()}>{merged.label}</FieldLabel>
      </Show>
      <div
        class={cx(
          'vui-mde',
          `vui-mde--${editor.mode()}`,
          !!merged.error && 'vui-mde--invalid',
          merged.disabled && 'vui-mde--disabled',
        )}
        style={{ '--mde-h': formatHeight(merged.height) }}
      >
        <div class="vui-mde__bar">
          <MarkdownEditorTabs mode={editor.mode()} onModeChange={editor.setMode} />
          <Show when={merged.toolbar && editor.showWrite() && !merged.readOnly}>
            <MarkdownEditorToolbar
              fieldId={fieldId()}
              modifierLabel={modifierLabel()}
              disabled={merged.disabled}
              onTool={editor.runTool}
            />
          </Show>
        </div>
        <div class="vui-mde__panes">
          <Show when={editor.showWrite()}>
            <textarea
              ref={editor.bindTextarea}
              id={fieldId()}
              class="vui-mde__input"
              value={editor.value()}
              placeholder={placeholder()}
              disabled={merged.disabled}
              readOnly={merged.readOnly}
              spellcheck
              aria-invalid={merged.error ? true : undefined}
              aria-describedby={footId()}
              onInput={editor.onInput}
              onKeyDown={editor.onKeyDown}
            />
          </Show>
          <Show when={editor.showPreview()}>
            <div
              class="vui-mde__preview"
              aria-label={translate('velvet.display.markdownEditor.previewLabel')}
              tabIndex={editor.mode() === 'preview' ? 0 : -1}
            >
              <Show
                when={editor.previewSource().trim()}
                fallback={
                  <EmptyText as="p" align="start" class="vui-mde__empty">
                    {previewEmpty()}
                  </EmptyText>
                }
              >
                <Markdown source={editor.previewSource()} size="sm" />
              </Show>
            </div>
          </Show>
        </div>
        <div class="vui-mde__foot" id={footId()}>
          <span class="vui-mde__md">
            <span class="vui-mde__mdmark" aria-hidden="true">
              M↓
            </span>
            {translate('velvet.display.markdownEditor.markdownSupported')}
          </span>
          <span class="vui-mde__count">
            {translate('velvet.display.markdownEditor.wordCount', { count: editor.words() })}
            <Show when={merged.maxLength}>{` · ${editor.value().length}/${merged.maxLength}`}</Show>
          </span>
        </div>
      </div>
      <Show when={hasMessage()}>
        <FieldHint error={!!merged.error} role={merged.error ? 'alert' : undefined}>
          {merged.error || merged.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
