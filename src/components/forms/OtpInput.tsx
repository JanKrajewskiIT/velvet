import { createUniqueId, Index, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { positiveInteger } from '../../utils/numericOption';
import { FieldHint } from '../primitives/FieldHint';
import { FieldLabel } from '../primitives/FieldLabel';
import { Separator } from '../primitives/Separator';
import { createFormValidation } from './createFormValidation';
import type { FormControlProps } from './formControl';
import { FormValue } from './FormValue';
import styles from './OtpInput.module.css';

const BLANK = ' ';
const NUMERIC_CHAR = /^[0-9]$/u;
const ALPHANUMERIC_CHAR = /^[a-z0-9]$/iu;
const SIX_BOXES = 6;
const EIGHT_BOXES = 8;

export interface OtpInputProps extends FormControlProps {
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
  const validation = createFormValidation();
  const length = () => Math.min(32, positiveInteger(p.length, SIX_BOXES));
  const cellLabel = (index: number, length: number) =>
    p.cellLabel ? p.cellLabel(index, length) : translate('velvet.forms.otpInput.cellLabel', { index, length });
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const [stored, setStored] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => {
      p.onValueChange?.(next);
      if (next.length === length() && !next.includes(BLANK)) p.onComplete?.(next);
    },
  });
  const cells: HTMLInputElement[] = [];

  /** One entry per box; `BLANK` marks an empty one. */
  const slots = () => stored().slice(0, length()).padEnd(length(), BLANK).split('');
  const charAt = (index: number) => {
    const char = slots()[index];
    return char && char !== BLANK ? char : '';
  };
  const split = () => p.groupAt ?? defaultGroupAt(length());
  const accepted = (chars: string) => {
    const pattern = p.numeric ? NUMERIC_CHAR : ALPHANUMERIC_CHAR;
    const kept = Array.from(chars).filter((char) => pattern.test(char));
    return p.numeric ? kept : kept.map((char) => char.toUpperCase());
  };
  const commit = (next: string[]) => {
    if (!p.disabled) setStored(next.join('').replace(/\s+$/u, ''));
  };
  const focusCell = (index: number) => {
    const cell = cells[clamp(index, 0, length() - 1)];
    cell?.focus();
    cell?.select();
  };
  const writeFrom = (index: number, chars: string[]) => {
    const next = slots();
    let at = index;
    for (const char of chars) {
      if (at >= length()) break;
      next[at++] = char;
    }
    commit(next);
    focusCell(at);
  };

  const onKeyDown = (index: number, e: KeyboardEvent) => {
    if (p.disabled || e.isComposing) return;
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
    <div
      class={styles.field}
      role="group"
      aria-label={p['aria-label']}
      aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${id()}-label` : undefined)}
    >
      <Show when={p.label}>
        <FieldLabel id={`${id()}-label`} required={p.required}>
          {p.label}
        </FieldLabel>
      </Show>
      <div class={cx(styles.otp, p.class)}>
        <Index each={slots()}>
          {(_, index) => (
            <>
              <Show when={split() > 0 && index === split()}>
                <Separator variant="dash" class={styles.otpPartSep} />
              </Show>
              <input
                ref={(cell) => (cells[index] = cell)}
                class={cx(
                  styles.otpPartCell,
                  !!p.error && styles.otpPartCellVariantInvalid,
                  charAt(index) && styles.otpPartCellVariantFilled,
                )}
                value={charAt(index)}
                inputMode={p.numeric ? 'numeric' : 'text'}
                autocomplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={length()}
                disabled={p.disabled}
                autofocus={p.autoFocus && index === 0}
                aria-label={cellLabel(index + 1, length())}
                aria-invalid={!!p.error || validation.invalid() || undefined}
                aria-describedby={validation.describedBy(p.error || p.hint ? `${id()}-hint` : undefined)}
                onInput={(e) => onInput(index, e.currentTarget)}
                onKeyDown={(e) => onKeyDown(index, e)}
                onPaste={(e) => onPaste(index, e)}
                onFocus={(e) => e.currentTarget.select()}
              />
            </>
          )}
        </Index>
      </div>
      <FormValue
        name={p.name}
        form={p.form}
        required={p.required}
        disabled={p.disabled}
        validation={validation}
        value={stored().length === length() && !stored().includes(BLANK) ? stored() : ''}
        focusInvalid={() => focusCell(0)}
        onReset={() => setStored(p.defaultValue)}
      />
      <Show when={p.error || p.hint}>
        <FieldHint id={`${id()}-hint`} error={!!p.error} aria-live="polite">
          {p.error || p.hint}
        </FieldHint>
      </Show>
    </div>
  );
};
