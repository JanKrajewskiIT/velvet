import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, on, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, minutesOfDay, startOfDay } from '../../utils/date';
import { Button } from '../actions/Button';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Calendar } from './Calendar';
import { callbackAlias } from './callbackAlias';
import { createPickerPopover } from './createPickerPopover';
import { DateField } from './DateField';
import { formatMinutes } from './time';

export interface DateTimePickerProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
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

/** The slot that contains the draft minute — scroll target when the draft is not on a step boundary. */
const isNear = (draftMinute: number | null, slot: number, step: number): boolean =>
  draftMinute !== null && slot <= draftMinute && draftMinute < slot + step;

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
  const locale = () => p.locale ?? i18n.locale();
  const step = () => Math.max(1, p.step);
  const [current, setCurrent] = createControllable<Date | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? null,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const popover = createPickerPopover(p.defaultOpen);
  const [draft, setDraft] = createSignal<Date | null>(current());
  let list: HTMLDivElement | undefined;

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
    return d ? `${fmtDate(d, locale())}, ${formatMinutes(minutesOfDay(d), p.hour12)}` : '';
  };
  const summary = () => {
    const d = draft();
    const minutes = draftMinutes();
    return d && minutes !== null ? `${fmtDate(d, locale(), SUMMARY_FORMAT)} · ${formatMinutes(minutes, p.hour12)}` : '';
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
    if (!day) return;
    const base = draft() ?? roundedNow(step());
    setDraft(withTime(day, minutesOfDay(base)));
  };
  const setTime = (minutes: number) => setDraft(withTime(draft() ?? startOfDay(new Date()), minutes));
  const apply = () => {
    setCurrent(draft());
    popover.closeToField();
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={p.id}>
      {(control) => (
        <span ref={popover.setWrap} class="vui-popover-wrap vui-datepicker">
          <DateField
            id={control.id}
            describedBy={control.describedBy}
            size={p.size}
            invalid={control.invalid}
            disabled={p.disabled}
            text={text()}
            placeholder={p.placeholder ?? translate('velvet.forms.dateTimePicker.placeholder')}
            open={popover.open()}
            onToggle={() => popover.setOpen(!popover.open())}
            onClear={p.clearable ? () => setCurrent(null) : undefined}
            clearLabel={translate('velvet.common.clear')}
            tabular
          />
          <Show when={popover.open()}>
            <div
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
                  <div
                    ref={list}
                    class="vui-dtpop__list"
                    role="listbox"
                    aria-label={translate('velvet.forms.dateTimePicker.timeLabel')}
                  >
                    <For each={slots()}>
                      {(minutes) => (
                        <button
                          type="button"
                          role="option"
                          aria-selected={minutes === draftMinutes()}
                          data-near={isNear(draftMinutes(), minutes, step()) ? 'true' : undefined}
                          disabled={isOff(minutes)}
                          class={cx('vui-dtpop__slot', minutes === draftMinutes() && 'vui-dtpop__slot--on')}
                          onClick={() => setTime(minutes)}
                        >
                          {formatMinutes(minutes, p.hour12)}
                        </button>
                      )}
                    </For>
                  </div>
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
