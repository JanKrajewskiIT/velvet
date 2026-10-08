import type { I18nKey } from '@jankrajewskiit/i18n';
import { createDeferred, createUniqueId, For, type JSX, mergeProps, onMount, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { FieldHint, FieldLabel } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Segmented, SegmentedItem } from '../primitives/Segmented';
import { createModifierLabel } from './createModifierLabel';
import { Markdown } from './Markdown';
import {
  applyTool,
  continueList,
  indentListLine,
  MARKDOWN_TOOLBAR,
  type MarkdownTool,
  type TextEdit,
  toolForShortcut,
  type ToolPlaceholders,
} from './markdownTools';

const MODES = [
  { id: 'write', labelKey: 'velvet.display.markdownEditor.modes.write' },
  { id: 'split', labelKey: 'velvet.display.markdownEditor.modes.split' },
  { id: 'preview', labelKey: 'velvet.display.markdownEditor.modes.preview' },
] as const satisfies readonly { id: string; labelKey: I18nKey }[];

export type MarkdownEditorMode = (typeof MODES)[number]['id'];

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

const countWords = (text: string): number => text.trim().match(/\S+/gu)?.length ?? 0;

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
  let textarea: HTMLTextAreaElement | undefined;

  const [value, setValue] = createControllable<string>({
    value: () => merged.value,
    defaultValue: merged.defaultValue,
    onChange: (next) => (merged.onChange ?? merged.onValueChange)?.(next),
  });
  const [mode, setMode] = createControllable<MarkdownEditorMode>({
    value: () => merged.mode,
    defaultValue: merged.defaultMode,
    onChange: (next) => merged.onModeChange?.(next),
  });
  const previewSource = createDeferred(value);
  const editable = () => !merged.disabled && !merged.readOnly;

  const limit = (text: string) =>
    merged.maxLength && text.length > merged.maxLength ? text.slice(0, merged.maxLength) : text;

  const commit = (edit: TextEdit) => {
    setValue(limit(edit.value));
    textarea?.focus({ preventScroll: true });
    textarea?.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  };

  const runTool = (tool: MarkdownTool) => {
    if (!textarea || !editable()) return;
    const placeholders: ToolPlaceholders = {
      wrap: (wrapTool) => translate(wrapTool.labelKey).toLowerCase(),
      link: translate('velvet.display.markdownEditor.placeholders.linkText'),
      block: translate('velvet.display.markdownEditor.placeholders.code'),
    };
    commit(applyTool(tool, value(), textarea.selectionStart, textarea.selectionEnd, placeholders));
  };

  const onInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    setValue(limit(e.currentTarget.value));
    e.currentTarget.value = value();
  };

  const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => {
    merged.onKeyDown?.(e);
    if (e.defaultPrevented || !editable()) return;
    const el = e.currentTarget;
    const hasModifier = e.metaKey || e.ctrlKey;
    if (hasModifier && !e.shiftKey && !e.altKey) {
      const tool = toolForShortcut(e.key);
      if (tool) {
        e.preventDefault();
        runTool(tool);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey && !hasModifier && el.selectionStart === el.selectionEnd) {
      const edit = continueList(value(), el.selectionStart);
      if (edit) {
        e.preventDefault();
        commit(edit);
      }
      return;
    }
    if (e.key === 'Tab' && !hasModifier) {
      const edit = indentListLine(value(), el.selectionStart, e.shiftKey);
      if (edit) {
        e.preventDefault();
        commit(edit);
      }
    }
  };

  const onTabsKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
    const index = MODES.findIndex((item) => item.id === mode());
    const targets: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % MODES.length,
      ArrowLeft: (index - 1 + MODES.length) % MODES.length,
      Home: 0,
      End: MODES.length - 1,
    };
    const target = targets[e.key];
    const next = target === undefined ? undefined : MODES[target];
    if (!next) return;
    e.preventDefault();
    setMode(next.id);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[MODES.indexOf(next)]?.focus();
  };

  onMount(() => {
    if (merged.autoFocus) textarea?.focus();
  });

  const words = () => countWords(value());
  const showWrite = () => mode() !== 'preview';
  const showPreview = () => mode() !== 'write';
  const hasMessage = () => !!(merged.error || merged.hint);

  return (
    <div class={cx('vui-field', 'vui-mde-field', merged.class)}>
      <Show when={merged.label}>
        <FieldLabel htmlFor={fieldId()}>{merged.label}</FieldLabel>
      </Show>
      <div
        class={cx(
          'vui-mde',
          `vui-mde--${mode()}`,
          !!merged.error && 'vui-mde--invalid',
          merged.disabled && 'vui-mde--disabled',
        )}
        style={{ '--mde-h': formatHeight(merged.height) }}
      >
        <div class="vui-mde__bar">
          <Segmented
            size="sm"
            class="vui-mde__tabs"
            role="tablist"
            aria-label={translate('velvet.display.markdownEditor.modesLabel')}
            onKeyDown={onTabsKeyDown}
          >
            <For each={MODES}>
              {(item) => (
                <SegmentedItem
                  role="tab"
                  tabIndex={mode() === item.id ? 0 : -1}
                  selected={mode() === item.id}
                  onClick={() => setMode(item.id)}
                >
                  {translate(item.labelKey)}
                </SegmentedItem>
              )}
            </For>
          </Segmented>
          <Show when={merged.toolbar && showWrite() && !merged.readOnly}>
            <div
              class="vui-mde__tools"
              role="toolbar"
              aria-label={translate('velvet.display.markdownEditor.toolbarLabel')}
              aria-controls={fieldId()}
            >
              <For each={MARKDOWN_TOOLBAR}>
                {(item) => (
                  <Show
                    when={item.kind !== 'separator' && item}
                    fallback={<span class="vui-mde__sep" aria-hidden="true" />}
                  >
                    {(tool) => (
                      <button
                        type="button"
                        class="vui-mde__tool"
                        disabled={merged.disabled}
                        title={
                          tool().shortcut
                            ? `${translate(tool().labelKey)} (${modifierLabel()}${tool().shortcut?.toUpperCase()})`
                            : translate(tool().labelKey)
                        }
                        aria-label={translate(tool().labelKey)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => runTool(tool())}
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
          </Show>
        </div>
        <div class="vui-mde__panes">
          <Show when={showWrite()}>
            <textarea
              ref={textarea}
              id={fieldId()}
              class="vui-mde__input"
              value={value()}
              placeholder={placeholder()}
              disabled={merged.disabled}
              readOnly={merged.readOnly}
              spellcheck
              aria-invalid={merged.error ? true : undefined}
              aria-describedby={footId()}
              onInput={onInput}
              onKeyDown={onKeyDown}
            />
          </Show>
          <Show when={showPreview()}>
            <div
              class="vui-mde__preview"
              aria-label={translate('velvet.display.markdownEditor.previewLabel')}
              tabIndex={mode() === 'preview' ? 0 : -1}
            >
              <Show
                when={previewSource().trim()}
                fallback={
                  <EmptyText as="p" align="start" class="vui-mde__empty">
                    {previewEmpty()}
                  </EmptyText>
                }
              >
                <Markdown source={previewSource()} size="sm" />
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
            {translate('velvet.display.markdownEditor.wordCount', { count: words() })}
            <Show when={merged.maxLength}>{` · ${value().length}/${merged.maxLength}`}</Show>
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
