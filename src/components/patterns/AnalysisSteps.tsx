import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';

export interface AnalysisStepsProps {
  steps: string[];
  /** Index of the current step. */
  step: number;
}

/** Progress list shown while an analysis runs — done · current · pending. */
export const AnalysisSteps = (props: AnalysisStepsProps) => (
  <ol class="vui-areq__steps" aria-live="polite">
    <For each={props.steps}>
      {(label, index) => (
        <li
          class={cx(
            'vui-areq__step',
            index() < props.step && 'vui-areq__step--done',
            index() === props.step && 'vui-areq__step--now',
          )}
        >
          <span class="vui-areq__sdot" aria-hidden="true">
            <Show when={index() < props.step}>
              <Glyph name="check" />
            </Show>
          </span>
          {label}
        </li>
      )}
    </For>
  </ol>
);
