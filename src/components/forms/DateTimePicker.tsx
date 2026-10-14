import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, type JSX, mergeProps, on, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, minutesOfDay, startOfDay } from '../../utils/date';
import { Button } from '../actions/Button';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Calendar } from './Calendar';
import { callbackAlias } from './callbackAlias';
import { createFormValidation } from './createFormValidation';
import { createPickerPopover } from './createPickerPopover';
import { DateField } from './DateField';
import { DateTimeSlots } from './DateTimeSlots';
import type { FormControlProps } from './formControl';
import { formDateTime } from './formDate';
import { FormValue } from './FormValue';
import { formatMinutes } from './time';

export interface DateTimePickerProps extends FormControlProps {
  serializeValue?: (date: Date) => string;
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: Date | null) => void;
  /** @default localized "Select date and time" */
  placeholder?: string;
  /** Earliest selectable moment (date and time). */
  min?: Date;
  max?: Date;
  /** Minutes between time slots. @default 30 */
  step?: number;
  /** @default false */
  hour12?: boolean;
  /** @default the active i18n locale */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** @default true */
  clearable?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  /** @default 'start' */
  align?: 'start' | 'end';
  id?: string;
}

const MINUTES_PER_DAY = 1440;
const SUMMARY_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

/** The next `step` boundary after now. */
const roundedNow = (step: number): Date => {
  const now = new Date();
  const minutes = Math.ceil(minutesOfDay(now) / step) * step;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(minutes / 60), minutes % 60);
};

const withTime = (day: Date, minutes: number): Date =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minutes / 60), minutes % 60);

/**
 * One field for a moment in time — meetings, deadlines, scheduled sends. The popover pairs the Calendar with a time column
 * (step list, auto-scrolled to the current pick); changes are a draft until Apply; "Now" jumps to the next step.
 * Times outside min/max are disabled. Use DatePicker when time does not matter, TimePicker for a time on its own.
 */
export const DateTimePicker = (props: DateTimePickerProps) => {
  const p = mergeProps(
    {
      step: 30,
      hour12: false,
      weekStartsOn: 1,
      clearable: true,
      size: 'md',
      defaultOpen: false,
      align: 'start',
    } satisfies Partial<DateTimePickerProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const validation = createFormValidation();
  const locale = () => p.locale ?? i18n.locale();
  const step = () => (Number.isFinite(p.step) ? Math.max(1, Math.min(MINUTES_PER_DAY, Math.trunc(p.step))) : 30);
  const [current, setCurrent] = createControllable<Date | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? null,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const popover = createPickerPopover(p.defaultOpen, () => p.align);
  const [draft, setDraft] = createSignal<Date | null>(current());
  let list: HTMLDivElement | undefined;
  let trigger!: HTMLButtonElement;
  const serialized = () => {
    const date = current();
    return date ? (p.serializeValue ?? formDateTime)(date) : '';
  };
  createEffect(() => {
    if (p.disabled) popover.close();
  });

  createEffect(
    on(popover.open, (isOpen) => {
      if (isOpen) setDraft(current() ?? roundedNow(step()));
    }),
  );

  const draftMinutes = () => {
    const d = draft();
    return d ? minutesOfDay(d) : null;
  };
  const slots = createMemo(() => {
    const size = step();
    return Array.from({ length: Math.ceil(MINUTES_PER_DAY / size) }, (_, i) => i * size);
  });
  const isOff = (minutes: number): boolean => {
    const d = draft();
    if (!d) return false;
    const moment = withTime(d, minutes);
    return (!!p.min && moment < p.min) || (!!p.max && moment > p.max);
  };
  const isValid = () => {
    const minutes = draftMinutes();
    return minutes !== null && !isOff(minutes);
  };
  const text = () => {
    const d = current();
    return d ? `${fmtDate(d, locale())}, ${formatMinutes(minutesOfDay(d), p.hour12, locale())}` : '';
  };
  const summary = () => {
    const d = draft();
    const minutes = draftMinutes();
    return d && minutes !== null
      ? `${fmtDate(d, locale(), SUMMARY_FORMAT)} · ${formatMinutes(minutes, p.hour12, locale())}`
      : '';
  };

  createEffect(
    on([popover.open, () => draft() && startOfDay(draft() ?? new Date()).getTime()], () => {
      if (!popover.open() || !list) return;
      const row =
        list.querySelector<HTMLElement>('[aria-selected="true"]') ??
        list.querySelector<HTMLElement>('[data-near="true"]');
      if (row) list.scrollTop = row.offsetTop - list.clientHeight / 2 + row.offsetHeight / 2;
    }),
  );

  const setDay = (day: Date | null) => {
    if (p.disabled || !day) return;
    const base = draft() ?? roundedNow(step());
    setDraft(withTime(day, minutesOfDay(base)));
  };
  const setTime = (minutes: number) => {
    if (!p.disabled && !isOff(minutes)) setDraft(withTime(draft() ?? startOfDay(new Date()), minutes));
  };
  const apply = () => {
    if (p.disabled || !isValid()) return;
    setCurrent(draft());
    popover.closeToField();
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={p.id}>
      {(control) => (
        <span ref={popover.setWrap} class="vui-popover-wrap vui-datepicker">
          <DateField
            ref={(element) => {
              trigger = element;
            }}
            aria-label={p['aria-label']}
            aria-labelledby={p['aria-labelledby']}
            id={control.id}
            describedBy={validation.describedBy(control.describedBy)}
            size={p.size}
            invalid={control.invalid || validation.invalid()}
            disabled={p.disabled}
            text={text()}
            placeholder={p.placeholder ?? translate('velvet.forms.dateTimePicker.placeholder')}
            open={popover.open()}
            onToggle={() => popover.setOpen(!popover.open())}
            onClear={p.clearable ? () => setCurrent(null) : undefined}
            clearLabel={translate('velvet.common.clear')}
            tabular
          />
          <FormValue
            validation={validation}
            name={p.name}
            form={p.form}
            required={p.required}
            disabled={p.disabled}
            value={serialized()}
            focusInvalid={() => trigger.focus()}
            onReset={() => {
              setCurrent(p.defaultValue ?? null);
              popover.close();
            }}
          />
          <Show when={popover.open()}>
            <div
              ref={popover.floating.ref}
              style={popover.floating.style()}
              class={cx('vui-popover', 'vui-datepop', 'vui-dtpop', p.align === 'end' && 'vui-popover--end')}
              role="dialog"
              aria-label={translate('velvet.forms.dateTimePicker.dialogLabel')}
            >
              <div class="vui-dtpop__body">
                <Calendar
                  value={draft()}
                  onValueChange={setDay}
                  min={p.min && startOfDay(p.min)}
                  max={p.max}
                  locale={locale()}
                  weekStartsOn={p.weekStartsOn}
                />
                <div class="vui-dtpop__times">
                  <div class="vui-dtpop__head">
                    <Glyph name="clock" />
                    {translate('velvet.forms.dateTimePicker.timeLabel')}
                  </div>
                  <DateTimeSlots
                    ref={(element) => {
                      list = element;
                    }}
                    slots={slots()}
                    value={draftMinutes()}
                    step={step()}
                    hour12={p.hour12}
                    locale={locale()}
                    label={translate('velvet.forms.dateTimePicker.timeLabel')}
                    isDisabled={isOff}
                    onSelect={setTime}
                  />
                </div>
              </div>
              <div class="vui-datepop__foot vui-rangepop__foot">
                <span class="vui-rangepop__sum" style={{ 'font-variant-numeric': 'tabular-nums' }}>
                  {summary()}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setDraft(roundedNow(step()))}>
                  {translate('velvet.forms.dateTimePicker.now')}
                </Button>
                <Button size="sm" disabled={!isValid()} onClick={apply}>
                  {translate('velvet.common.apply')}
                </Button>
              </div>
            </div>
          </Show>
        </span>
      )}
    </Field>
  );
};
