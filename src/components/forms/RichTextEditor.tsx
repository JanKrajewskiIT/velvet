import { createMemo, createUniqueId, type JSX, mergeProps, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { FieldLabel } from '../primitives/FieldLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createRichTextCommands } from './createRichTextCommands';
import { createRichTextHistory } from './createRichTextHistory';
import { createRichTextInput } from './createRichTextInput';
import { createRichTextState } from './createRichTextState';
import styles from './RichTextEditor.module.css';
import { resolveLinkLabels, type RichTextLinkLabels, RichTextLinkPopover } from './RichTextLinkPopover';
import { createRichTextFragment } from './richTextModel';
import { RichTextToolbar } from './RichTextToolbar';
import { TOOL_LABEL_KEYS, toolbarEntries, type ToolId } from './richTextTools';

export interface RichTextLabels extends RichTextLinkLabels {
  /** Accessible name of the formatting toolbar. */
  toolbar: string;
}

export interface RichTextEditorProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  /** Initial HTML (sanitized). The editor is uncontrolled. */
  defaultValue?: string;
  /** Fires on content change with sanitized HTML (`''` when empty) and the plain text. */
  onValueChange?: (html: string, text: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (html: string, text: string) => void;
  /** @default localized "Write something…" */
  placeholder?: string;
  /** px. @default 140 */
  minHeight?: number;
  /** px — scrolls beyond. */
  maxHeight?: number;
  /** Soft limit on plain-text length; the counter turns red past it. */
  maxLength?: number;
  /** `full` · `minimal` (bold, italic, lists, link) · `false` (shortcuts and markdown only). @default 'full' */
  toolbar?: 'full' | 'minimal' | false;
  /** Overrides for the toolbar button names. */
  toolLabels?: Partial<Record<ToolId, string>>;
  /** Overrides for the toolbar and link-popover texts. */
  labels?: Partial<RichTextLabels>;
  disabled?: boolean;
  /** Renders the content without toolbar or editing. */
  readOnly?: boolean;
  class?: string;
}

/** Dependency-free WYSIWYG for comments, descriptions and notes, built on `contenteditable` with its own editing engine and undo stack. Output is allow-listed HTML: p h2 h3 blockquote pre ul ol li strong em u s code a[href] br. */
export const RichTextEditor = (props: RichTextEditorProps) => {
  const p = mergeProps(
    { defaultValue: '', minHeight: 140, toolbar: 'full' } satisfies Partial<RichTextEditorProps>,
    props,
  );
  const translate = useTranslate();
  const id = createUniqueId();
  const placeholder = () => p.placeholder ?? translate('velvet.forms.richTextEditor.placeholder');
  const toolLabel = (tool: ToolId) => p.toolLabels?.[tool] ?? translate(TOOL_LABEL_KEYS[tool]);
  const labels = createMemo<RichTextLabels>(() => ({
    toolbar: p.labels?.toolbar ?? translate('velvet.forms.richTextEditor.toolbar'),
    ...resolveLinkLabels(p.labels, translate),
  }));
  const editable = () => !p.disabled && !p.readOnly;
  const emitChange = (html: string, text: string) => (p.onValueChange ?? p.onChange)?.(html, text);
  let editor!: HTMLDivElement;

  const state = createRichTextState({ editor: () => editor, emitChange });
  const history = createRichTextHistory({
    root: () => editor,
    onRestore: () => {
      state.pending.clear();
      state.afterChange();
    },
  });
  const commands = createRichTextCommands({
    editor: () => editor,
    editable,
    invalidText: () => labels().invalid,
    state,
    history,
  });
  const { link, exec } = commands;

  onMount(() => {
    editor.replaceChildren(createRichTextFragment(p.defaultValue));
    history.record();
    state.afterChange();
  });

  const input = createRichTextInput({ editor: () => editor, state, history, commands });

  return (
    <div class={cx(styles.field, p.class)}>
      <Show when={p.label}>
        <FieldLabel id={`${id}-label`}>{p.label}</FieldLabel>
      </Show>
      <div class={cx(styles.rte, p.disabled && styles.rteVariantDisabled, !!p.error && styles.rteVariantInvalid)}>
        <Show when={p.toolbar && !p.readOnly ? p.toolbar : undefined}>
          {(toolbar) => (
            <RichTextToolbar
              entries={toolbarEntries(toolbar())}
              format={state.format()}
              canUndo={history.canUndo()}
              canRedo={history.canRedo()}
              disabled={p.disabled}
              label={labels().toolbar}
              controls={`${id}-editor`}
              toolLabel={toolLabel}
              onTool={exec}
            />
          )}
        </Show>
        <Show when={link.draft()}>
          {(draft) => (
            <RichTextLinkPopover
              href={draft().href}
              error={draft().error}
              existing={draft().existing}
              labels={labels()}
              onHrefChange={link.setHref}
              onApply={() => link.commit(false)}
              onRemove={() => link.commit(true)}
              onClose={link.close}
            />
          )}
        </Show>
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- contenteditable receives focus natively; tabIndex would make the disabled and read-only states tabbable */}
        <div
          ref={(element) => {
            editor = element;
          }}
          id={`${id}-editor`}
          class={cx(styles.rtePartArea, typographyClass('body'))}
          contentEditable={editable()}
          spellcheck
          role="textbox"
          aria-multiline="true"
          aria-labelledby={p.label ? `${id}-label` : undefined}
          aria-label={p.label ? undefined : placeholder()}
          aria-describedby={p.hint || p.error ? `${id}-hint` : undefined}
          aria-placeholder={placeholder()}
          aria-invalid={!!p.error || undefined}
          aria-disabled={p.disabled || undefined}
          aria-readonly={p.readOnly || undefined}
          data-placeholder={placeholder()}
          data-empty={state.empty() || undefined}
          style={{
            'min-height': `${p.minHeight}px`,
            'max-height': p.maxHeight === undefined ? undefined : `${p.maxHeight}px`,
          }}
          onInput={input.onInput}
          onKeyDown={input.onKeyDown}
          onPaste={input.onPaste}
          onMouseDown={input.onMouseDown}
          onClick={input.onClick}
        />
      </div>
      <Show when={p.hint || p.error || p.maxLength}>
        <div class={styles.fieldPartFoot}>
          <Text
            as="span"
            variant="caption"
            tone="inherit"
            id={`${id}-hint`}
            class={cx(styles.hint, !!p.error && styles.hintVariantError)}
          >
            {p.error || p.hint}
          </Text>
          <Show when={p.maxLength}>
            {(max) => (
              <Text
                as="span"
                variant="kbd"
                tone="inherit"
                class={cx(
                  styles.hint,
                  styles.fieldPartCount,
                  state.textLength() > max() && styles.fieldPartCountVariantMax,
                )}
                aria-live="polite"
              >
                {state.textLength()}/{max()}
              </Text>
            )}
          </Show>
        </div>
      </Show>
    </div>
  );
};
