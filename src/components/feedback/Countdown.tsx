import type { I18nKey } from '@jankrajewskiit/i18n';
import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
  untrack,
} from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { pad, toDate } from '../../utils/date';
import type { HtmlProps } from '../../utils/polymorphic';
import { Separator } from '../primitives/Separator';

const COUNTDOWN_UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

export type CountdownUnit = (typeof COUNTDOWN_UNITS)[number];

const UNIT_LABEL_KEYS = {
  days: 'velvet.feedback.countdown.days',
  hours: 'velvet.feedback.countdown.hours',
  minutes: 'velvet.feedback.countdown.minutes',
  seconds: 'velvet.feedback.countdown.seconds',
} as const satisfies Record<CountdownUnit, I18nKey>;
const SECONDS_PER: Record<CountdownUnit, number> = { days: 86400, hours: 3600, minutes: 60, seconds: 1 };
const UNIT_MODULO: Record<CountdownUnit, number> = { days: Infinity, hours: 24, minutes: 60, seconds: 60 };

const TICK_MS = 1000;
const TICK_SLACK_MS = 5;

export interface CountdownProps extends HtmlProps<HTMLDivElement> {
  to: Date | string | number;
  onComplete?: () => void;
  /** @default ['days', 'hours', 'minutes', 'seconds'] */
  units?: readonly CountdownUnit[];
  /** Unit captions; units left out keep their localized default. */
  labels?: Partial<Record<CountdownUnit, string>>;
  /** boxes = tiles with labels · inline = 02:14:09. @default 'boxes' */
  variant?: 'boxes' | 'inline';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** Live countdown to a date — launches, offers, auction ends. Screen readers get one summary label, not per-second chatter. */
export const Countdown = (props: CountdownProps) => {
  const merged = mergeProps(
    { units: COUNTDOWN_UNITS, variant: 'boxes', size: 'md' } satisfies Partial<CountdownProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['to', 'onComplete', 'units', 'labels', 'variant', 'size', 'class']);
  const translate = useTranslate();
  const [now, setNow] = createSignal(Date.now());
  const target = createMemo(() => +toDate(local.to));

  createEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < target()) timer = setTimeout(tick, TICK_MS - (current % TICK_MS) + TICK_SLACK_MS);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') setNow(Date.now());
    };
    tick();
    document.addEventListener('visibilitychange', onVisible);
    onCleanup(() => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    });
  });

  const remainingSeconds = createMemo(() =>
    Number.isFinite(target()) ? Math.floor(Math.max(0, target() - now()) / 1000) : 0,
  );
  const valueOf = (unit: CountdownUnit): number =>
    Math.floor(remainingSeconds() / SECONDS_PER[unit]) % UNIT_MODULO[unit];
  const labelOf = (unit: CountdownUnit): string => local.labels?.[unit] ?? translate(UNIT_LABEL_KEYS[unit]);
  const textOf = (unit: CountdownUnit): string => (unit === 'days' ? String(valueOf(unit)) : pad(valueOf(unit)));
  const summary = () => local.units.map((unit) => `${valueOf(unit)} ${labelOf(unit).toLowerCase()}`).join(', ');

  let completedFor: number | undefined;
  createEffect(() => {
    if (remainingSeconds() !== 0 || target() === completedFor) return;
    completedFor = target();
    untrack(() => local.onComplete?.());
  });

  return (
    <div
      {...rest}
      class={cx('vui-countdown', `vui-countdown--${local.variant}`, `vui-countdown--${local.size}`, local.class)}
      role="timer"
      aria-label={translate('velvet.feedback.countdown.remaining', { summary: summary() })}
    >
      <Index each={local.units}>
        {(unit, i) => (
          <>
            <Show when={local.variant === 'inline' && i > 0}>
              <Separator variant="text">:</Separator>
            </Show>
            <span class="vui-countdown__unit" aria-hidden="true">
              <Show when={textOf(unit())} keyed>
                {(text) => <span class="vui-countdown__num">{text}</span>}
              </Show>
              <Show when={local.variant === 'boxes'}>
                <span class="vui-countdown__label">{labelOf(unit())}</span>
              </Show>
            </span>
          </>
        )}
      </Index>
    </div>
  );
};
