import { createMemo, createSignal, type JSX } from 'solid-js';

import { Control } from '../primitives/Control';
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
}

/** One numeric bound: grouped per locale at rest, raw text while focused, clamped on commit. */
export const RangeBound = (props: RangeBoundProps) => {
  const format = createMemo(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 2 }));
  const formatted = (value: number | null | undefined) => (isBoundSet(value) ? format().format(value) : '');
  const [focused, setFocused] = createSignal(false);
  const [text, setText] = createSignal('');
  const shown = () => (focused() ? text() : formatted(props.value));

  const commit = () => {
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
      class="vui-range__bound"
    >
      <input
        id={props.id}
        class="vui-control__input"
        inputMode="decimal"
        value={shown()}
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.describedBy}
        disabled={props.disabled}
        onFocus={() => {
          setText(isBoundSet(props.value) ? String(props.value) : '');
          setFocused(true);
        }}
        onBlur={commit}
        onInput={(event) => {
          const filtered = event.currentTarget.value.replace(/[^\d.,\s-]/gu, '');
          event.currentTarget.value = filtered;
          setText(filtered);
          setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
        }}
      />
    </Control>
  );
};
