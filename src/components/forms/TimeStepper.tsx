import { useI18n } from '@jankrajewskiit/i18n';
import { mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx, modifier } from '../../utils/cx';
import { pad } from '../../utils/date';
import { callbackAlias } from './callbackAlias';
import { meridiemOf, timeOf } from './time';
import { TimeStepperColumn } from './TimeStepperColumn';

export interface TimeStepperProps {
  /** "HH:MM" 24h. */
  value?: string;
  /** @default '09:00' */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string) => void;
  /** Show 12h + AM/PM toggle. @default true */
  hour12?: boolean;
  /** Minutes per step. @default 5 */
  minuteStep?: number;
  /** Accessible group label. @default localized "Time" */
  label?: string;
  /** @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
  class?: string;
}

const HALF_DAY = 12;

const parseParts = (time: string): [hours: number, minutes: number] => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return [hours || 0, minutes || 0];
};

/** Inline hour/minute stepper with AM/PM toggle — for popovers, schedulers and touch where a typed TimePicker is awkward. Values wrap at their bounds. ↑/↓ step, PgUp/PgDn ×5. */
export const TimeStepper = (props: TimeStepperProps) => {
  const p = mergeProps(
    { defaultValue: '09:00', hour12: true, minuteStep: 5, size: 'md' } satisfies Partial<TimeStepperProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const [current, setCurrent] = createControllable<string>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const parts = () => parseParts(current());
  const hours = () => parts()[0];
  const minutes = () => parts()[1];
  const pm = () => hours() >= HALF_DAY;
  const displayHours = () => (p.hour12 ? ((hours() + HALF_DAY - 1) % HALF_DAY) + 1 : hours());

  const set = (nextHours: number, nextMinutes: number) => setCurrent(timeOf(nextHours, nextMinutes));
  const stepHours = (direction: number) => set(hours() + direction, minutes());
  const stepMinutes = (direction: number) => {
    const total = hours() * 60 + minutes() + direction * p.minuteStep;
    set(Math.floor(total / 60), ((total % 60) + 60) % 60);
  };

  return (
    <div
      role="group"
      aria-label={p.label ?? translate('velvet.forms.timeStepper.label')}
      class={cx('vui-tstep', modifier('vui-tstep', p.size, 'md'), p.disabled && 'vui-tstep--disabled', p.class)}
    >
      <TimeStepperColumn
        name={translate('velvet.forms.timeStepper.hours')}
        increaseLabel={translate('velvet.forms.timeStepper.increaseHours')}
        decreaseLabel={translate('velvet.forms.timeStepper.decreaseHours')}
        text={pad(displayHours())}
        value={hours()}
        max={23}
        disabled={p.disabled}
        onStep={stepHours}
      />
      <span class="vui-tstep__sep" aria-hidden="true">
        :
      </span>
      <TimeStepperColumn
        name={translate('velvet.forms.timeStepper.minutes')}
        increaseLabel={translate('velvet.forms.timeStepper.increaseMinutes')}
        decreaseLabel={translate('velvet.forms.timeStepper.decreaseMinutes')}
        text={pad(minutes())}
        value={minutes()}
        max={59}
        disabled={p.disabled}
        onStep={stepMinutes}
      />
      <Show when={p.hour12}>
        <button
          type="button"
          class="vui-tstep__ap"
          aria-label={translate('velvet.forms.timeStepper.switchTo', {
            period: meridiemOf(pm() ? 0 : HALF_DAY, i18n.locale()),
          })}
          disabled={p.disabled}
          onClick={() => set(hours() + HALF_DAY, minutes())}
        >
          {meridiemOf(hours(), i18n.locale())}
        </button>
      </Show>
    </div>
  );
};
