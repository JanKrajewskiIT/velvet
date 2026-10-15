import { children, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './SetupChecklistStep.module.css';

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
  layout?: 'list' | 'grid';
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
      data-layout={props.layout}
      href={props.step.href}
      type={!props.step.href && props.step.onClick ? 'button' : undefined}
      onClick={props.step.onClick}
      class={cx(
        styles.checklistPartStep,
        props.step.done && styles.checklistPartStepVariantDone,
        props.next && styles.checklistPartStepVariantNext,
        isAction() && styles.checklistPartStepVariantAction,
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
          <Text as="span" variant="label-sm" tone="inherit" class={styles.checklistPartNum}>
            {props.index + 1}
          </Text>
        </IconTile>
      </Show>
      <span class={styles.checklistPartText}>
        <Text as="span" variant="label" class={styles.checklistPartLabel}>
          {label()}
          <Show when={props.step.done}>
            <VisuallyHidden> {translate('velvet.feedback.setupChecklist.stepDone')}</VisuallyHidden>
          </Show>
        </Text>
        <Show when={description()}>
          <Text as="span" variant="caption" tone="secondary" class={styles.checklistPartDesc}>
            {description()}
          </Text>
        </Show>
      </span>
      <Show when={isAction() && !props.step.done}>
        <Glyph name="chevron-right" class={styles.checklistPartGo} />
      </Show>
    </Polymorphic>
  );
};
