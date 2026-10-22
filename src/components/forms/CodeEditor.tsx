import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Index,
  type JSX,
  mergeProps,
  on,
  Show,
  splitProps,
  untrack,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { ownsLayerEvent } from '../../hooks/createLayer';
import { useTranslate } from '../../i18n/useTranslate';
import { assignRef } from '../../utils/assignRef';
import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './CodeEditor.module.css';
import { tokenizeCode } from './highlightCode';

const TOKEN_CLASSES = {
  key: styles.key,
  keyword: styles.keyword,
  string: styles.string,
  number: styles.number,
  comment: styles.comment,
  function: styles.function,
  text: undefined,
} as const;
const LINE_HEIGHT = 20;
const VERTICAL_PADDING = 24;

export interface CodeEditorProps extends Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'style'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  language?: string;
  rows?: number;
  maxHeight?: number | string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  highlight?: boolean;
  style?: JSX.CSSProperties;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const merged = mergeProps(
    {
      defaultValue: '',
      language: 'text',
      rows: 12,
      lineNumbers: true,
      highlight: true,
    } satisfies Partial<CodeEditorProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'value',
    'defaultValue',
    'onValueChange',
    'label',
    'hint',
    'error',
    'language',
    'rows',
    'maxHeight',
    'readOnly',
    'lineNumbers',
    'highlight',
    'id',
    'class',
    'style',
    'ref',
    'onInput',
    'onChange',
    'onKeyDown',
    'onScroll',
    'onBlur',
    'aria-describedby',
  ]);
  const translate = useTranslate();
  const autoId = createUniqueId();
  const id = () => local.id ?? `ce-${autoId}`;
  const [value, setValue] = createControllable({
    value: () => local.value,
    defaultValue: untrack(() => local.defaultValue),
    onChange: (next) => local.onValueChange?.(next),
  });
  const [indent, setIndent] = createSignal(true);
  const tokens = createMemo(() => (local.highlight ? tokenizeCode(value()) : []));
  const lines = createMemo(() => Array.from({ length: value().split('\n').length }, (_, index) => index + 1));
  let pre: HTMLPreElement | undefined;
  let gutter: HTMLDivElement | undefined;
  let textarea: HTMLTextAreaElement | undefined;
  const sync = (element: HTMLTextAreaElement) => {
    if (pre) {
      pre.scrollTop = element.scrollTop;
      pre.scrollLeft = element.scrollLeft;
    }
    if (gutter) gutter.scrollTop = element.scrollTop;
  };
  createEffect(
    on([value, () => local.highlight, () => local.lineNumbers], () => {
      if (textarea) sync(textarea);
    }),
  );
  const onKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (event) => {
    callHandler(local.onKeyDown, event);
    if (event.defaultPrevented || event.isComposing) return;
    if (event.key === 'Escape') {
      if (local.readOnly || !ownsLayerEvent(event.currentTarget)) return;
      if (indent() || event.repeat) {
        event.preventDefault();
        event.stopPropagation();
        setIndent(false);
      }
      return;
    }
    if (
      event.key !== 'Tab' ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      !indent() ||
      local.readOnly
    )
      return;
    event.preventDefault();
    const element = event.currentTarget;
    const start = element.selectionStart;
    const next = `${value().slice(0, start)}  ${value().slice(element.selectionEnd)}`;
    if (element.maxLength >= 0 && next.length > element.maxLength) return;
    element.value = next;
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: '  ' }));
    element.setSelectionRange(start + 2, start + 2);
    sync(element);
  };
  return (
    <div
      class={cx(styles.root, local.error && styles.invalid, local.readOnly && styles.readOnly, local.class)}
      style={local.style}
    >
      <Show when={local.label}>
        <label for={id()} class={styles.label}>
          {local.label}
          <span class={styles.language}>{local.language}</span>
        </label>
      </Show>
      <div
        class={styles.box}
        style={{
          height: `${local.rows * LINE_HEIGHT + VERTICAL_PADDING}px`,
          'max-height': typeof local.maxHeight === 'number' ? `${local.maxHeight}px` : local.maxHeight,
        }}
      >
        <Show when={local.lineNumbers}>
          <div
            ref={(element) => {
              gutter = element;
            }}
            class={styles.gutter}
            aria-hidden="true"
          >
            <Index each={lines()}>{(line) => <div>{line()}</div>}</Index>
          </div>
        </Show>
        <div class={styles.area}>
          <Show when={local.highlight}>
            <pre
              ref={(element) => {
                pre = element;
              }}
              class={styles.pre}
              aria-hidden="true"
            >
              <For each={tokens()}>{(token) => <span class={TOKEN_CLASSES[token.kind]}>{token.text}</span>}</For>
              {'\n'}
            </pre>
          </Show>
          <textarea
            {...rest}
            ref={(element) => {
              textarea = element;
              assignRef(local.ref, element);
            }}
            id={id()}
            class={cx(styles.textarea, local.highlight && styles.highlight)}
            value={value()}
            rows={local.rows}
            readOnly={local.readOnly}
            spellcheck={false}
            autocapitalize="off"
            autocorrect="off"
            aria-invalid={local.error ? true : rest['aria-invalid']}
            aria-describedby={[
              local['aria-describedby'],
              `${id()}-keys`,
              local.error || local.hint ? `${id()}-hint` : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            onInput={(event) => {
              setValue(event.currentTarget.value);
              callHandler(local.onInput, event);
              callHandler(local.onChange, event);
            }}
            on:keydown={onKeyDown}
            onScroll={(event) => {
              sync(event.currentTarget);
              callHandler(local.onScroll, event);
            }}
            onBlur={(event) => {
              setIndent(true);
              callHandler(local.onBlur, event);
            }}
          />
        </div>
      </div>
      <VisuallyHidden id={`${id()}-keys`}>{translate('velvet.forms.codeEditor.keyboardHint')}</VisuallyHidden>
      <Show when={local.error || local.hint}>
        <div id={`${id()}-hint`} class={cx(styles.hint, local.error && styles.error)}>
          {local.error || local.hint}
        </div>
      </Show>
    </div>
  );
};
