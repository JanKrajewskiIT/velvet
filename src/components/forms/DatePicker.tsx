import { useI18n } from '@jankrajewskiit/i18n';
import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, startOfDay } from '../../utils/date';
import { Button } from '../actions/Button';
import { FieldLabel } from '../primitives/Field';
import { Calendar } from './Calendar';
import { callbackAlias } from './callbackAlias';
import { createPickerPopover } from './createPickerPopover';
import { DateField } from './DateField';

export interface DatePickerProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (date: Date | null) => void;
  /** @default localized "Select date" */
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** @default the active i18n locale */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** Custom field text. */
  format?: (date: Date) => string;
  /** @default true */
  clearable?: boolean;
  /** Popover alignment. @default 'start' */
  align?: 'start' | 'end';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Start with the popover open (docs, onboarding). @default false */
  defaultOpen?: boolean;
  id?: string;
}

/** Date field → calendar popover. Today / Clear in the footer, Esc closes and refocuses. Compact: the field is a button, no free typing. */
export const DatePicker = (props: DatePickerProps) => {
  const p = mergeProps(
    {
      weekStartsOn: 1,
      clearable: true,
      align: 'start',
      size: 'md',
      defaultOpen: false,
    } satisfies Partial<DatePickerProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => p.locale ?? i18n.locale();
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const hintId = () => `${id()}-hint`;
  const [current, setCurrent] = createControllable<Date | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? null,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const popover = createPickerPopover(p.defaultOpen);
  const text = () => {
    const date = current();
    if (!date) return '';
    return p.format ? p.format(date) : fmtDate(date, locale());
  };
  const choose = (date: Date | null) => {
    setCurrent(date);
    popover.closeToField();
  };

  return (
    <div class="vui-field">
      <span ref={popover.setWrap} class="vui-popover-wrap vui-datepicker">
        <div class="vui-field" style={{ width: '100%' }}>
          <Show when={p.label}>
            <FieldLabel htmlFor={id()} optional={p.optional}>
              {p.label}
            </FieldLabel>
          </Show>
          <DateField
            id={id()}
            describedBy={p.error || p.hint ? hintId() : undefined}
            size={p.size}
            invalid={!!p.error}
            disabled={p.disabled}
            text={text()}
            placeholder={p.placeholder ?? translate('velvet.forms.datePicker.placeholder')}
            open={popover.open()}
            onToggle={() => popover.setOpen(!popover.open())}
            onClear={p.clearable ? () => setCurrent(null) : undefined}
          />
        </div>
        <Show when={popover.open()}>
          <div
            class={cx('vui-popover', 'vui-datepop', p.align === 'end' && 'vui-popover--end')}
            role="dialog"
            aria-label={translate('velvet.forms.datePicker.dialogLabel')}
          >
            <Calendar
              value={current()}
              onValueChange={choose}
              min={p.min}
              max={p.max}
              isDisabled={p.isDisabled}
              locale={locale()}
              weekStartsOn={p.weekStartsOn}
            />
            <div class="vui-datepop__foot">
              <Button variant="ghost" size="sm" onClick={() => choose(startOfDay(new Date()))}>
                {translate('velvet.common.today')}
              </Button>
              <Show when={p.clearable && current()}>
                <Button variant="ghost" size="sm" onClick={() => choose(null)}>
                  {translate('velvet.common.clear')}
                </Button>
              </Show>
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
