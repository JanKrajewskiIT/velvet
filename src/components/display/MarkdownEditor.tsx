import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { FieldHint } from '../primitives/FieldHint';
import { FieldLabel } from '../primitives/FieldLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createMarkdownEditor } from './createMarkdownEditor';
import { createModifierLabel } from './createModifierLabel';
import { Markdown } from './Markdown';
import styles from './MarkdownEditor.module.css';
import type { MarkdownEditorMode } from './markdownEditorModes';
import { MarkdownEditorTabs } from './MarkdownEditorTabs';
import { MarkdownEditorToolbar } from './MarkdownEditorToolbar';

const MDE_CLASSES = {
  invalid: styles.mdeVariantInvalid,
  disabled: styles.mdeVariantDisabled,
  split: styles.mdeVariantSplit,
} as const;

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
    <div class={cx(styles.field, styles.mdeField, merged.class)}>
      <Show when={merged.label}>
        <FieldLabel htmlFor={fieldId()}>{merged.label}</FieldLabel>
      </Show>
      <div
        class={cx(
          styles.mde,
          variantClass(MDE_CLASSES, editor.mode()),
          !!merged.error && styles.mdeVariantInvalid,
          merged.disabled && styles.mdeVariantDisabled,
        )}
        style={{ '--mde-h': formatHeight(merged.height) }}
      >
        <div class={styles.mdePartBar}>
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
        <div class={styles.mdePartPanes}>
          <Show when={editor.showWrite()}>
            <textarea
              ref={editor.bindTextarea}
              id={fieldId()}
              class={cx(styles.mdePartInput, typographyClass('code'))}
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
              class={styles.mdePartPreview}
              aria-label={translate('velvet.display.markdownEditor.previewLabel')}
              tabIndex={editor.mode() === 'preview' ? 0 : -1}
            >
              <Show
                when={editor.previewSource().trim()}
                fallback={
                  <EmptyText as="p" align="start" class={styles.mdePartEmpty}>
                    {previewEmpty()}
                  </EmptyText>
                }
              >
                <Markdown source={editor.previewSource()} size="sm" />
              </Show>
            </div>
          </Show>
        </div>
        <Text as="div" variant="caption" tone="tertiary" class={styles.mdePartFoot} id={footId()}>
          <Text as="span" variant="micro" tone="inherit" class={styles.mdePartMd}>
            <Text as="span" variant="micro" tone="secondary" class={styles.mdePartMdmark} aria-hidden="true">
              M↓
            </Text>
            {translate('velvet.display.markdownEditor.markdownSupported')}
          </Text>
          <Text as="span" variant="caption" tone="inherit" tabular class="vui-mde__count">
            {translate('velvet.display.markdownEditor.wordCount', { count: editor.words() })}
            <Show when={merged.maxLength}>{` · ${editor.value().length}/${merged.maxLength}`}</Show>
          </Text>
        </Text>
      </div>
      <Show when={hasMessage()}>
        <FieldHint error={!!merged.error} role={merged.error ? 'alert' : undefined}>
          {merged.error || merged.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
