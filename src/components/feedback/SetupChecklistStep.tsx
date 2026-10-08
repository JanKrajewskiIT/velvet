import { children, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { VisuallyHidden } from '../primitives/VisuallyHidden';

export interface ChecklistStep {
  id?: string;
  label: JSX.Element;
  description?: JSX.Element;
  /** Velvet icon shown until the step is done (else the step number). */
  icon?: string;
  done?: boolean;
  /** Renders the step as a link. */
  href?: string;
  /** Renders the step as a button (when no `href`). */
  onClick?: () => void;
}

export interface SetupChecklistStepProps {
  step: ChecklistStep;
  /** Zero-based position. */
  index: number;
  /** The first open step. */
  next: boolean;
}

/** One row of a SetupChecklist: a link, a button or plain text depending on `href` / `onClick`. */
export const SetupChecklistStep = (props: SetupChecklistStepProps) => {
  const translate = useTranslate();
  const label = children(() => props.step.label);
  const description = children(() => props.step.description);
  const isAction = () => !!(props.step.href || props.step.onClick);
  const tag = () => (props.step.href ? 'a' : props.step.onClick ? 'button' : 'div');
  const markTone = () => (props.step.done ? 'success' : props.next ? 'brand' : undefined);
  const showNumber = () => !props.step.done && !props.step.icon;

  return (
    <Polymorphic
      tag={tag()}
      href={props.step.href}
      type={!props.step.href && props.step.onClick ? 'button' : undefined}
      onClick={props.step.onClick}
      class={cx(
        'vui-checklist__step',
        props.step.done && 'vui-checklist__step--done',
        props.next && 'vui-checklist__step--next',
        isAction() && 'vui-checklist__step--action',
      )}
      aria-current={props.next ? 'step' : undefined}
    >
      <Show
        when={showNumber()}
        fallback={
          <IconTile
            size="sm"
            shape="circle"
            tone={markTone()}
            icon={props.step.done ? 'check' : props.step.icon}
            class="vui-checklist__mark"
          />
        }
      >
        <IconTile size="sm" shape="circle" tone={markTone()} class="vui-checklist__mark">
          <span class="vui-checklist__num">{props.index + 1}</span>
        </IconTile>
      </Show>
      <span class="vui-checklist__text">
        <span class="vui-checklist__label">
          {label()}
          <Show when={props.step.done}>
            <VisuallyHidden> {translate('velvet.feedback.setupChecklist.stepDone')}</VisuallyHidden>
          </Show>
        </span>
        <Show when={description()}>
          <span class="vui-checklist__desc">{description()}</span>
        </Show>
      </span>
      <Show when={isAction() && !props.step.done}>
        <Glyph name="chevron-right" class="vui-checklist__go" />
      </Show>
    </Polymorphic>
  );
};
