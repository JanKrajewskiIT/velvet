import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './AnalysisSteps.module.css';

export interface AnalysisStepsProps {
  steps: string[];
  /** Index of the current step. */
  step: number;
}

/** Progress list shown while an analysis runs — done · current · pending. */
export const AnalysisSteps = (props: AnalysisStepsProps) => (
  <ol class={styles.areqPartSteps} aria-live="polite">
    <For each={props.steps}>
      {(label, index) => (
        <Text
          as="li"
          variant={index() === props.step ? 'label' : 'body-sm'}
          tone="inherit"
          class={cx(
            styles.areqPartStep,
            index() < props.step && styles.areqPartStepVariantDone,
            index() === props.step && styles.areqPartStepVariantNow,
          )}
        >
          <span class={styles.areqPartSdot} aria-hidden="true">
            <Show when={index() < props.step}>
              <Glyph name="check" />
            </Show>
          </span>
          {label}
        </Text>
      )}
    </For>
  </ol>
);
