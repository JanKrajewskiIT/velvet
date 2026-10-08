import { createEffect, createSignal, For, type JSX, Match, mergeProps, on, onCleanup, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { Marker } from '../primitives/Marker';

export interface StepItem {
  label: JSX.Element;
  description?: JSX.Element;
}

export type StepStatus = 'done' | 'current' | 'todo' | 'error';

export interface StepperLabels {
  /** List name. */
  navigation: string;
  /** Screen-reader suffix of a completed step. */
  done: string;
  /** Screen-reader suffix of a step with errors. */
  error: string;
}

export interface StepperProps {
  steps: StepItem[];
  /** 0-based. @default 0 */
  current?: number;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Makes steps clickable */
  onStepClick?: (index: number) => void;
  /** true: only completed steps are clickable · false: any step (free navigation). @default true */
  linear?: boolean;
  /** Index of a step that failed validation */
  errorAt?: number;
  labels?: Partial<StepperLabels>;
  class?: string;
}

const POP_DURATION_MS = 400;
const FOCUS_STEP: Readonly<Record<'horizontal' | 'vertical', Readonly<Record<string, number>>>> = {
  horizontal: { ArrowRight: 1, ArrowLeft: -1 },
  vertical: { ArrowDown: 1, ArrowUp: -1 },
};

/**
 * Progress through ordered steps: done (✓) · current · upcoming · error. Animated: connector fills, a node pops when it completes.
 * With onStepClick steps become buttons (←→ / ↑↓ move focus).
 */
export const Stepper = (props: StepperProps) => {
  const p = mergeProps({ current: 0, orientation: 'horizontal', linear: true } satisfies Partial<StepperProps>, props);
  const translate = useTranslate();
  const labels = (): StepperLabels => ({
    navigation: p.labels?.navigation ?? translate('velvet.navigation.stepper.navigation'),
    done: p.labels?.done ?? translate('velvet.navigation.stepper.done'),
    error: p.labels?.error ?? translate('velvet.navigation.stepper.error'),
  });
  const [popping, setPopping] = createSignal<number[]>([]);
  let root!: HTMLOListElement;

  createEffect(
    on(
      () => p.current,
      (current, previous = current) => {
        if (current <= previous) return;
        setPopping(Array.from({ length: current - previous }, (_, i) => previous + i));
        const timer = setTimeout(() => setPopping([]), POP_DURATION_MS);
        onCleanup(() => clearTimeout(timer));
      },
      { defer: true },
    ),
  );

  const statusOf = (index: number): StepStatus => {
    if (index === p.errorAt) return 'error';
    if (index < p.current) return 'done';
    return index === p.current ? 'current' : 'todo';
  };
  const statusSuffix = (status: StepStatus): string => {
    if (status === 'done') return ` (${labels().done})`;
    return status === 'error' ? ` (${labels().error})` : '';
  };
  const canClick = (index: number) => !!p.onStepClick && index !== p.current && (!p.linear || index < p.current);

  const onKeyDown: JSX.EventHandler<HTMLOListElement, KeyboardEvent> = (e) => {
    const step = p.onStepClick ? FOCUS_STEP[p.orientation][e.key] : undefined;
    if (!step) return;
    const buttons = [...root.querySelectorAll<HTMLElement>('.vui-step__inner')];
    const at = buttons.findIndex((button) => button === document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    buttons[at + step]?.focus();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- keydown only bubbles up from the step buttons to move focus between them
    <ol
      ref={root}
      class={cx('vui-stepper', `vui-stepper--${p.orientation}`, p.class)}
      aria-label={labels().navigation}
      onKeyDown={onKeyDown}
    >
      <For each={p.steps}>
        {(step, i) => {
          const status = () => statusOf(i());
          const interactive = () => !!p.onStepClick;
          return (
            <li
              class={cx('vui-step', `vui-step--${status()}`, popping().includes(i()) && 'vui-step--pop')}
              aria-current={status() === 'current' ? 'step' : undefined}
            >
              <Polymorphic
                tag={interactive() ? 'button' : 'div'}
                type={interactive() ? 'button' : undefined}
                disabled={interactive() && !canClick(i()) && i() !== p.current ? true : undefined}
                class="vui-step__inner"
                onClick={() => canClick(i()) && p.onStepClick?.(i())}
              >
                <Marker
                  class="vui-step__dot"
                  appearance={status() === 'done' || status() === 'error' ? 'solid' : 'outline'}
                  tone={status() === 'error' ? 'danger' : status() === 'todo' ? undefined : 'brand'}
                  ring={status() === 'current'}
                >
                  <Switch fallback={i() + 1}>
                    <Match when={status() === 'done'}>
                      <Glyph name="check" />
                    </Match>
                    <Match when={status() === 'error'}>
                      <Glyph name="x" />
                    </Match>
                  </Switch>
                </Marker>
                <span class="vui-step__text">
                  <span class="vui-step__label">
                    {step.label}
                    <span class="vui-sr-only">{statusSuffix(status())}</span>
                  </span>
                  <Show when={step.description}>
                    <span class="vui-step__desc">{step.description}</span>
                  </Show>
                </span>
              </Polymorphic>
              <Show when={i() < p.steps.length - 1}>
                <span class="vui-step__line" aria-hidden="true" />
              </Show>
            </li>
          );
        }}
      </For>
    </ol>
  );
};
