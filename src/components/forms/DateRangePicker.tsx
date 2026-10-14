import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, createUniqueId, type JSX, mergeProps, on, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createToday } from '../../hooks/createToday';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addMonths, DAY_MS, fmtDate, sameDay } from '../../utils/date';
import { Button } from '../actions/Button';
import { FieldLabel } from '../primitives/FieldLabel';
import { Calendar } from './Calendar';
import { startOfMonth } from './calendarGrid';
import type { DateRange } from './calendarTypes';
import { callbackAlias } from './callbackAlias';
import { createFormValidation } from './createFormValidation';
import { createPickerPopover } from './createPickerPopover';
import { isDateRangeAllowed } from './dateConstraints';
import { DateField } from './DateField';
import { DateRangePresets } from './DateRangePresets';
import type { FormControlProps } from './formControl';
import { formDate } from './formDate';
import { FormValue } from './FormValue';
import { DEFAULT_RANGE_PRESETS, presetLabel, type RangePreset } from './rangePresets';

export interface DateRangePickerProps extends FormControlProps {
  serializeValue?: (range: DateRange) => string | readonly string[];
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  /** Alias of `onValueChange`. */
  onChange?: (range: DateRange) => void;
  /** Defaults: Today, Last 7 / 30 days, This / Last month, This year. [] hides the column. */
  presets?: readonly RangePreset[];
  /** @default localized "Select dates" */
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** @default the active i18n locale */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** @default 'start' */
  align?: 'start' | 'end';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  id?: string;
}

const NARROW_QUERY = '(max-width: 599px)';

const emptyRange = (): DateRange => ({ start: null, end: null });
type ResolvedDateRangePickerProps = DateRangePickerProps &
  Required<Pick<DateRangePickerProps, 'presets' | 'weekStartsOn' | 'align' | 'size' | 'defaultOpen'>>;

/** Range field → popover with presets column + two months (one on narrow screens). Changes are a draft until Apply; footer shows the span in days. */
export const DateRangePicker = (props: DateRangePickerProps) => {
  const p: ResolvedDateRangePickerProps = mergeProps(
    {
      presets: DEFAULT_RANGE_PRESETS,
      weekStartsOn: 1,
      align: 'start',
      size: 'md',
      defaultOpen: false,
    } satisfies Partial<DateRangePickerProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const validation = createFormValidation();
  const today = createToday();
  const locale = () => p.locale ?? i18n.locale();
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const hintId = () => `${id()}-hint`;
  const [current, setCurrent] = createControllable<DateRange>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? emptyRange(),
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const popover = createPickerPopover(p.defaultOpen, () => p.align);
  let trigger!: HTMLButtonElement;
  createEffect(() => {
    if (p.disabled) popover.close();
  });
  const serialized = () => {
    const range = current();
    if (!range.start || !range.end) return [];
    return p.serializeValue ? p.serializeValue(range) : [formDate(range.start), formDate(range.end)];
  };
  const [draft, setDraft] = createSignal<DateRange>(current());
  const [narrow, setNarrow] = createSignal(false);
  const [month, setMonth] = createSignal(startOfMonth(new Date()));

  /** Month shown first: the end date sits in the second month when two are visible. */
  const monthFor = (range: DateRange, singleMonth: boolean): Date => {
    if (range.start && singleMonth) return startOfMonth(range.start);
    if (range.end) return addMonths(range.end, -1);
    return startOfMonth(range.start ?? new Date());
  };
  const showRange = (range: DateRange) => {
    setDraft(range);
    setMonth(monthFor(range, narrow()));
  };

  createEffect(
    on(popover.open, (isOpen) => {
      if (!isOpen) return;
      setNarrow(window.matchMedia(NARROW_QUERY).matches);
      showRange(current());
    }),
  );

  const formatRange = (range: DateRange): string => {
    const { start, end } = range;
    if (!start) return '';
    const crossesYear = !!end && end.getFullYear() !== start.getFullYear();
    const from = fmtDate(start, locale(), {
      month: 'short',
      day: 'numeric',
      ...(crossesYear ? { year: 'numeric' } : {}),
    });
    return `${from} – ${end ? fmtDate(end, locale()) : '…'}`;
  };
  const days = () => {
    const { start, end } = draft();
    return start && end ? Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1 : 0;
  };
  const presetChoices = createMemo(() => {
    today();
    return p.presets.map((preset) => {
      const range = preset.range();
      return { range, label: presetLabel(preset, translate), disabled: !isDateRangeAllowed(range, p) };
    });
  });
  const activePreset = () =>
    presetChoices().findIndex(({ range }) => sameDay(range.start, draft().start) && sameDay(range.end, draft().end));
  const canApply = () => isDateRangeAllowed(draft(), p);
  const summary = () => {
    if (!draft().start) return translate('velvet.forms.dateRangePicker.pickStartDate');
    const count = days();
    return count
      ? translate('velvet.forms.dateRangePicker.summary', { range: formatRange(draft()), count })
      : formatRange(draft());
  };
  const apply = () => {
    if (p.disabled || !canApply()) return;
    setCurrent(draft());
    popover.closeToField();
  };

  return (
    <div class="vui-field">
      <span ref={popover.setWrap} class="vui-popover-wrap vui-datepicker">
        <div class="vui-field" style={{ width: '100%' }}>
          <Show when={p.label}>
            <FieldLabel htmlFor={id()} optional={p.optional} required={p.required}>
              {p.label}
            </FieldLabel>
          </Show>
          <DateField
            ref={(element) => {
              trigger = element;
            }}
            aria-label={p['aria-label']}
            aria-labelledby={p['aria-labelledby']}
            id={id()}
            describedBy={validation.describedBy(p.error || p.hint ? hintId() : undefined)}
            size={p.size}
            invalid={!!p.error || validation.invalid()}
            disabled={p.disabled}
            text={formatRange(current())}
            placeholder={p.placeholder ?? translate('velvet.forms.dateRangePicker.placeholder')}
            open={popover.open()}
            onToggle={() => popover.setOpen(!popover.open())}
            onClear={() => setCurrent(emptyRange())}
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
              setCurrent(p.defaultValue ?? emptyRange());
              popover.close();
            }}
          />
        </div>
        <Show when={popover.open()}>
          <div
            ref={popover.floating.ref}
            style={popover.floating.style()}
            class={cx('vui-popover', 'vui-datepop', 'vui-rangepop', p.align === 'end' && 'vui-popover--end')}
            role="dialog"
            aria-label={translate('velvet.forms.dateRangePicker.dialogLabel')}
          >
            <div class="vui-rangepop__body">
              <Show when={p.presets.length > 0}>
                <DateRangePresets
                  choices={presetChoices()}
                  active={activePreset()}
                  label={translate('velvet.forms.dateRangePicker.presetsLabel')}
                  onSelect={(range) => {
                    if (!p.disabled && isDateRangeAllowed(range, p)) showRange(range);
                  }}
                />
              </Show>
              <Calendar
                mode="range"
                months={narrow() ? 1 : 2}
                value={draft()}
                onValueChange={setDraft}
                month={month()}
                onMonthChange={setMonth}
                min={p.min}
                max={p.max}
                isDisabled={p.isDisabled}
                locale={locale()}
                weekStartsOn={p.weekStartsOn}
              />
            </div>
            <div class="vui-datepop__foot vui-rangepop__foot">
              <span class="vui-rangepop__sum">{summary()}</span>
              <Button variant="ghost" size="sm" onClick={popover.closeToField}>
                {translate('velvet.common.cancel')}
              </Button>
              <Button size="sm" disabled={!canApply()} onClick={apply}>
                {translate('velvet.common.apply')}
              </Button>
            </div>
          </div>
        </Show>
      </span>
      <Show when={p.error || p.hint}>
        <span id={hintId()} class={cx('vui-hint', !!p.error && 'vui-hint--error')}>
          {p.error || p.hint}
        </span>
      </Show>
    </div>
  );
};
