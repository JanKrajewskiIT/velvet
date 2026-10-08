import { createEffect, createSignal, type JSX, mergeProps, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Stepper } from './Stepper';

export interface WizardStep {
  label: JSX.Element;
  description?: JSX.Element;
  content: JSX.Element;
  /** Return an error string (sync or async) to block Next */
  validate?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Hide the step heading above content */
  title?: false;
}

export interface WizardLabels {
  cancel: string;
  back: string;
  next: string;
  step: (index: number, count: number) => string;
  /** Shown when `validate` or `onFinish` rejects. */
  failed: string;
}

export interface WizardProps {
  steps: WizardStep[];
  /** Awaited — Finish shows a spinner meanwhile. A rejection shows `labels.failed` on the last step. */
  onFinish?: () => void | Promise<void>;
  /** Receives the rejection of `validate` or `onFinish`. */
  onError?: (error: unknown) => void;
  /** Shows Cancel instead of Back on step 1 */
  onCancel?: () => void;
  /** @default localized "Finish" */
  finishLabel?: string;
  /** @default 0 */
  defaultStep?: number;
  labels?: Partial<WizardLabels>;
  class?: string;
}

/** Multi-step flow that owns its index: Stepper on top, one step's content, Back / Next → Finish. Validation errors mark the step red and block. Focus moves to the new panel. */
export const Wizard = (props: WizardProps) => {
  const p = mergeProps({ defaultStep: 0 } satisfies Partial<WizardProps>, props);
  const translate = useTranslate();
  const labels = (): WizardLabels => ({
    cancel: p.labels?.cancel ?? translate('velvet.common.cancel'),
    back: p.labels?.back ?? translate('velvet.common.back'),
    next: p.labels?.next ?? translate('velvet.common.next'),
    step: p.labels?.step ?? ((index, count) => translate('velvet.navigation.wizard.step', { index, count })),
    failed: p.labels?.failed ?? translate('velvet.navigation.wizard.failed'),
  });
  const finishLabel = () => p.finishLabel ?? translate('velvet.navigation.wizard.finish');
  const [index, setIndex] = createSignal(p.defaultStep);
  const [error, setError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);
  const step = () => p.steps[index()];
  const last = () => index() === p.steps.length - 1;
  let panel: HTMLDivElement | undefined;
  let run = 0;

  createEffect(on(index, () => panel?.focus({ preventScroll: true }), { defer: true }));

  const goTo = (target: number) => {
    run += 1;
    setBusy(false);
    setError(null);
    setIndex(target);
  };

  const next = async () => {
    const current = step();
    const mine = ++run;
    setError(null);
    try {
      const message = await current?.validate?.();
      if (mine !== run) return;
      if (message) return setError(message);
      if (!last()) return setIndex(index() + 1);
      setBusy(true);
      await p.onFinish?.();
    } catch (failure) {
      if (mine !== run) return;
      setError(labels().failed);
      p.onError?.(failure);
    }
    if (mine === run) setBusy(false);
  };

  return (
    <div class={cx('vui-wizard', p.class)}>
      <Stepper steps={p.steps} current={index()} errorAt={error() ? index() : undefined} onStepClick={goTo} />
      <Show when={step()} keyed>
        {(current) => (
          <div
            ref={panel}
            tabIndex={-1}
            class="vui-wizard__panel"
            role="group"
            aria-label={typeof current.label === 'string' ? current.label : undefined}
          >
            <Show when={current.title !== false}>
              <div class="vui-wizard__title">{current.label}</div>
            </Show>
            {current.content}
            <Show when={error()}>
              {(message) => (
                <div class="vui-hint vui-hint--error" role="alert" style={{ 'margin-top': '12px' }}>
                  {message()}
                </div>
              )}
            </Show>
          </div>
        )}
      </Show>
      <div class="vui-wizard__foot">
        <Show
          when={p.onCancel && index() === 0}
          fallback={
            <Button
              variant="secondary"
              iconLeft="arrow-left"
              disabled={index() === 0}
              onClick={() => goTo(index() - 1)}
            >
              {labels().back}
            </Button>
          }
        >
          <Button variant="ghost" onClick={() => p.onCancel?.()}>
            {labels().cancel}
          </Button>
        </Show>
        <span class="vui-wizard__count">{labels().step(index() + 1, p.steps.length)}</span>
        <Button loading={busy()} iconRight={last() ? null : 'arrow-right'} onClick={() => void next()}>
          {last() ? finishLabel() : labels().next}
        </Button>
      </div>
    </div>
  );
};
