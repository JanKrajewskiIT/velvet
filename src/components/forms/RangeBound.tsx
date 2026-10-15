import { createEffect, createMemo, createSignal, type JSX, on } from 'solid-js';

import { parseDecimal } from '../../utils/decimalValue';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import styles from './RangeBound.module.css';
import { isBoundSet, parseBound } from './rangeValue';

export interface RangeBoundProps {
  id?: string;
  value: number | null | undefined;
  onCommit: (value: number | null) => void;
  locale?: string;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  describedBy?: string;
  ref?: (element: HTMLInputElement) => void;
  resetKey?: number;
  onValidityChange?: (invalid: boolean) => void;
}

/** One numeric bound: grouped per locale at rest, raw text while focused, clamped on commit. */
export const RangeBound = (props: RangeBoundProps) => {
  const format = createMemo(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 2 }));
  const formatted = (value: number | null | undefined) => (isBoundSet(value) ? format().format(value) : '');
  const [focused, setFocused] = createSignal(false);
  const [text, setText] = createSignal('');
  const shown = () => (focused() ? text() : formatted(props.value));
  const invalidText = () => text().trim() !== '' && parseDecimal(text().replace(/[\s\u00a0]/gu, '')) === undefined;
  createEffect(
    on(
      () => props.resetKey,
      () => {
        setFocused(false);
        setText('');
        props.onValidityChange?.(false);
      },
    ),
  );

  const commit = () => {
    if (props.disabled) return;
    props.onValidityChange?.(invalidText());
    if (invalidText()) return;
    setFocused(false);
    props.onCommit(parseBound(text(), props.value, props.min, props.max));
  };

  return (
    <Control
      size={props.size}
      disabled={props.disabled}
      invalid={props.invalid}
      prefix={props.prefix}
      suffix={props.suffix}
      class={styles.rangePartBound}
    >
      <ControlInput
        ref={props.ref}
        id={props.id}
        inputMode="decimal"
        value={shown()}
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.describedBy}
        disabled={props.disabled}
        onFocus={() => {
          if (!invalidText()) setText(isBoundSet(props.value) ? String(props.value) : '');
          setFocused(true);
        }}
        onBlur={commit}
        onInput={(event) => {
          setText(event.currentTarget.value);
          props.onValidityChange?.(invalidText());
          setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
        }}
      />
    </Control>
  );
};
