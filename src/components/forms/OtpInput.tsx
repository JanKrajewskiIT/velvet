import { createUniqueId, Index, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { FieldHint } from '../primitives/FieldHint';
import { FieldLabel } from '../primitives/FieldLabel';
import { Separator } from '../primitives/Separator';

const BLANK = ' ';
const NUMERIC_CHAR = /^[0-9]$/u;
const ALPHANUMERIC_CHAR = /^[a-z0-9]$/iu;
const SIX_BOXES = 6;
const EIGHT_BOXES = 8;

export interface OtpInputProps {
  /** @default 6 */
  length?: number;
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  /** Controlled code. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once every box is filled. */
  onComplete?: (code: string) => void;
  /** Digits only. false = A–Z/0–9, upper-cased. @default true */
  numeric?: boolean;
  /** Index where a visual gap is inserted. Default 3 for 6 boxes, 4 for 8, none otherwise. 0 = no gap. */
  groupAt?: number;
  /** Accessible name of each box. @default localized "Digit {index} of {length}" */
  cellLabel?: (index: number, length: number) => string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  class?: string;
}

const defaultGroupAt = (length: number): number => {
  if (length === SIX_BOXES) return SIX_BOXES / 2;
  return length === EIGHT_BOXES ? EIGHT_BOXES / 2 : 0;
};

/** One-time-code boxes: auto-advance, Backspace steps back, ←→ move, paste fills from the focused box. `autocomplete="one-time-code"` lets SMS codes autofill on mobile. */
export const OtpInput = (props: OtpInputProps) => {
  const p = mergeProps({ length: SIX_BOXES, numeric: true, defaultValue: '' } satisfies OtpInputProps, props);
  const translate = useTranslate();
  const cellLabel = (index: number, length: number) =>
    p.cellLabel ? p.cellLabel(index, length) : translate('velvet.forms.otpInput.cellLabel', { index, length });
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const [stored, setStored] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => {
      p.onValueChange?.(next);
      if (next.length === p.length && !next.includes(BLANK)) p.onComplete?.(next);
    },
  });
  const cells: HTMLInputElement[] = [];

  /** One entry per box; `BLANK` marks an empty one. */
  const slots = () => stored().slice(0, p.length).padEnd(p.length, BLANK).split('');
  const charAt = (index: number) => {
    const char = slots()[index];
    return char && char !== BLANK ? char : '';
  };
  const split = () => p.groupAt ?? defaultGroupAt(p.length);
  const accepted = (chars: string) => {
    const pattern = p.numeric ? NUMERIC_CHAR : ALPHANUMERIC_CHAR;
    const kept = Array.from(chars).filter((char) => pattern.test(char));
    return p.numeric ? kept : kept.map((char) => char.toUpperCase());
  };
  const commit = (next: string[]) => setStored(next.join('').replace(/\s+$/u, ''));
  const focusCell = (index: number) => {
    const cell = cells[clamp(index, 0, p.length - 1)];
    cell?.focus();
    cell?.select();
  };
  const writeFrom = (index: number, chars: string[]) => {
    const next = slots();
    let at = index;
    for (const char of chars) {
      if (at >= p.length) break;
      next[at++] = char;
    }
    commit(next);
    focusCell(at);
  };

  const onKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = slots();
      if (charAt(index)) {
        next[index] = BLANK;
        commit(next);
      } else if (index > 0) {
        next[index - 1] = BLANK;
        commit(next);
        focusCell(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusCell(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusCell(index + 1);
    }
  };
  const onInput = (index: number, input: HTMLInputElement) => {
    const chars = accepted(input.value);
    if (chars.length) writeFrom(index, chars);
    input.value = charAt(index);
  };
  const onPaste = (index: number, e: ClipboardEvent) => {
    e.preventDefault();
    const chars = accepted(e.clipboardData?.getData('text') ?? '');
    if (chars.length) writeFrom(index, chars);
  };

  return (
    <div class="vui-field" role="group" aria-labelledby={p.label ? `${id()}-label` : undefined}>
      <Show when={p.label}>
        <FieldLabel id={`${id()}-label`}>{p.label}</FieldLabel>
      </Show>
      <div class={cx('vui-otp', p.class)}>
        <Index each={slots()}>
          {(_, index) => (
            <>
              <Show when={split() > 0 && index === split()}>
                <Separator variant="dash" class="vui-otp__sep" />
              </Show>
              <input
                ref={(cell) => (cells[index] = cell)}
                class={cx(
                  'vui-otp__cell',
                  !!p.error && 'vui-otp__cell--invalid',
                  charAt(index) && 'vui-otp__cell--filled',
                )}
                value={charAt(index)}
                inputMode={p.numeric ? 'numeric' : 'text'}
                autocomplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={p.length}
                disabled={p.disabled}
                autofocus={p.autoFocus && index === 0}
                aria-label={cellLabel(index + 1, p.length)}
                aria-invalid={!!p.error || undefined}
                aria-describedby={p.error || p.hint ? `${id()}-hint` : undefined}
                onInput={(e) => onInput(index, e.currentTarget)}
                onKeyDown={(e) => onKeyDown(index, e)}
                onPaste={(e) => onPaste(index, e)}
                onFocus={(e) => e.currentTarget.select()}
              />
            </>
          )}
        </Index>
      </div>
      <Show when={p.error || p.hint}>
        <FieldHint id={`${id()}-hint`} error={!!p.error} aria-live="polite">
          {p.error || p.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
