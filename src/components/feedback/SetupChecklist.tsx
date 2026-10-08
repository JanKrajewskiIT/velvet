import { children, createMemo, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { IconButton } from '../actions/IconButton';
import { Progress } from './Progress';
import { type ChecklistStep, SetupChecklistStep } from './SetupChecklistStep';

export interface SetupChecklistProps extends HtmlProps<HTMLElement, 'title'> {
  /** @default localized "Get started" */
  title?: JSX.Element;
  description?: JSX.Element;
  steps: readonly ChecklistStep[];
  /** list = stacked rows (side column, popover) · grid = tiles in a row (dashboard hero). @default 'list' */
  layout?: 'list' | 'grid';
  /** Hide the card once every step is done. @default true */
  hideWhenComplete?: boolean;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** @default localized "Dismiss" */
  dismissLabel?: string;
  /** Progress text. @default localized "{done} of {total} done" */
  progressFormat?: (done: number, total: number) => string;
}

/** "Get started" card for first-run setup. Steps are independent and done in any order; the first open step is highlighted. */
export const SetupChecklist = (props: SetupChecklistProps) => {
  const merged = mergeProps({ layout: 'list', hideWhenComplete: true } satisfies Partial<SetupChecklistProps>, props);
  const [local, rest] = splitProps(merged, [
    'title',
    'description',
    'steps',
    'layout',
    'hideWhenComplete',
    'onDismiss',
    'dismissLabel',
    'progressFormat',
    'class',
  ]);
  const translate = useTranslate();
  const title = children(() =>
    local.title === undefined ? translate('velvet.feedback.setupChecklist.title') : local.title,
  );
  const description = children(() => local.description);
  const doneCount = createMemo(() => local.steps.filter((step) => step.done).length);
  const progressText = () =>
    local.progressFormat
      ? local.progressFormat(doneCount(), local.steps.length)
      : translate('velvet.feedback.setupChecklist.progress', { done: doneCount(), total: local.steps.length });
  const complete = () => local.steps.length > 0 && doneCount() === local.steps.length;
  const nextIndex = createMemo(() => local.steps.findIndex((step) => !step.done));
  const ariaLabel = () => {
    const text = title();
    return typeof text === 'string' ? text : undefined;
  };

  return (
    <Show when={!(local.hideWhenComplete && complete())}>
      <section
        {...rest}
        class={cx('vui-checklist', `vui-checklist--${local.layout}`, local.class)}
        aria-label={ariaLabel()}
      >
        <header class="vui-checklist__head">
          <div class="vui-checklist__intro">
            <h3 class="vui-checklist__title">{title()}</h3>
            <Show when={description()}>
              <p class="vui-checklist__lede">{description()}</p>
            </Show>
          </div>
          <Show when={local.onDismiss}>
            <IconButton
              icon="x"
              label={local.dismissLabel ?? translate('velvet.common.dismiss')}
              size="sm"
              onClick={() => local.onDismiss?.()}
            />
          </Show>
        </header>
        <Progress
          value={doneCount()}
          max={local.steps.length || 1}
          size="sm"
          showValue
          format={progressText}
          tone={doneCount() === local.steps.length ? 'success' : 'brand'}
          class="vui-checklist__progress"
        />
        <ol class="vui-checklist__list">
          <For each={local.steps}>
            {(step, i) => (
              <li>
                <SetupChecklistStep step={step} index={i()} next={i() === nextIndex()} />
              </li>
            )}
          </For>
        </ol>
      </section>
    </Show>
  );
};
