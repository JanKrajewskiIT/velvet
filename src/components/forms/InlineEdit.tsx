import { batch, createSignal, type JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Control } from '../primitives/Control';
import { Glyph } from '../primitives/Glyph';
import type { Validator } from './createValidation';

const SAVED_FLASH_MS = 1200;

export interface InlineEditProps {
  /** Controlled value. */
  value?: string;
  /** @default '' */
  defaultValue?: string;
  /** May return a Promise: the field stays open and locked while pending; on rejection the draft is kept and `saveErrorText` shows. */
  onSave?: (value: string) => void | Promise<void>;
  /** @default localized "Click to add…" */
  placeholder?: string;
  /** Accessible name, e.g. "Project title". */
  label?: string;
  /** sm = table cell · md = body · lg = page title (display font). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Return an error string to block the save. */
  validate?: Validator;
  disabled?: boolean;
  /** @default localized "Save" */
  saveLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /** Shown when `onSave` rejects. @default localized "Couldn’t save — try again." */
  saveErrorText?: string;
  class?: string;
}

/** Click-to-edit value, no separate form or modal. Enter or blur saves, Esc cancels, focus returns to the value. A brief ✓ confirms a save. */
export const InlineEdit = (props: InlineEditProps) => {
  const p = mergeProps({ defaultValue: '', size: 'md' } satisfies Partial<InlineEditProps>, props);
  const translate = useTranslate();
  const placeholder = () => p.placeholder ?? translate('velvet.forms.inlineEdit.placeholder');
  const [current, setCurrent] = createControllable({ value: () => p.value, defaultValue: p.defaultValue });
  const [editing, setEditing] = createSignal(false);
  const [draft, setDraft] = createSignal('');
  const [error, setError] = createSignal<string>();
  const [saved, setSaved] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  let trigger: HTMLButtonElement | undefined;
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(flashTimer));

  const close = (restoreFocus: boolean) => {
    batch(() => {
      setEditing(false);
      setError(undefined);
    });
    if (restoreFocus) trigger?.focus();
  };

  const start = () => {
    if (p.disabled) return;
    batch(() => {
      setDraft(current());
      setError(undefined);
      setEditing(true);
    });
  };

  const flashSaved = () => {
    setSaved(true);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => setSaved(false), SAVED_FLASH_MS);
  };

  const save = async (restoreFocus: boolean) => {
    if (busy() || p.disabled) return;
    const next = draft().trim();
    const invalid = p.validate?.(next);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (next !== current()) {
      setBusy(true);
      try {
        await p.onSave?.(next);
      } catch {
        batch(() => {
          setBusy(false);
          setError(p.saveErrorText ?? translate('velvet.forms.inlineEdit.saveErrorText'));
        });
        return;
      }
      batch(() => {
        setBusy(false);
        setCurrent(next);
      });
      flashSaved();
    }
    close(restoreFocus);
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void save(true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
  };

  const keepInputFocus: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => event.preventDefault();

  const focusAndSelect = (input: HTMLInputElement) =>
    queueMicrotask(() => {
      input.focus();
      input.select();
    });

  return (
    <Show
      when={editing()}
      fallback={
        <button
          ref={trigger}
          type="button"
          class={cx(
            'vui-inline-edit',
            `vui-inline-edit--${p.size}`,
            !current() && 'vui-inline-edit--empty',
            saved() && 'vui-inline-edit--saved',
            p.class,
          )}
          onClick={start}
          disabled={p.disabled}
          aria-label={p.label ? `${p.label}: ${current() || placeholder()}` : undefined}
        >
          <span class="vui-inline-edit__text">{current() || placeholder()}</span>
          <Glyph name={saved() ? 'check' : 'pencil'} class="vui-inline-edit__icon" />
        </button>
      }
    >
      <div class={cx('vui-inline-edit__form', `vui-inline-edit--${p.size}`, p.class)}>
        <Control size={p.size === 'sm' ? 'sm' : 'md'} invalid={!!error()} style={{ flex: 1 }}>
          <input
            ref={focusAndSelect}
            class="vui-control__input"
            value={draft()}
            aria-label={p.label}
            aria-invalid={!!error() || undefined}
            aria-busy={busy() || undefined}
            readOnly={p.disabled || busy()}
            onInput={(event) => {
              setDraft(event.currentTarget.value);
              setError(undefined);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => void save(false)}
          />
        </Control>
        <Show when={!p.disabled}>
          <IconButton
            icon="check"
            label={p.saveLabel ?? translate('velvet.common.save')}
            variant="primary"
            size="sm"
            disabled={busy()}
            aria-busy={busy() || undefined}
            onMouseDown={keepInputFocus}
            onClick={() => void save(true)}
          />
        </Show>
        <IconButton
          icon="x"
          label={p.cancelLabel ?? translate('velvet.common.cancel')}
          variant="secondary"
          size="sm"
          disabled={busy()}
          onMouseDown={keepInputFocus}
          onClick={() => close(true)}
        />
        <Show when={error()}>
          {(message) => (
            <span class="vui-hint vui-hint--error vui-inline-edit__err" role="alert">
              {message()}
            </span>
          )}
        </Show>
      </div>
    </Show>
  );
};
