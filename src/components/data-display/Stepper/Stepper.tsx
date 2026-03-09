import { FiCheck } from 'solid-icons/fi';
import { For, Show } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './Stepper.module.css';

interface StepperStep {
  value: string;
  label: string;
}

interface StepperProps {
  steps: StepperStep[];
  activeStep: string;
}

const Stepper = (props: Props<StepperProps>) => {
  const activeIndex = () =>
    props.steps.findIndex((s) => s.value === props.activeStep);

  const getStepState = (index: number) => {
    const current = activeIndex();
    if (index < current) return 'completed';
    if (index === current) return 'active';
    return 'pending';
  };

  return (
    <div class={`${styles.stepIndicator} ${props.class ?? ''}`}>
      <For each={props.steps}>
        {(step, index) => (
          <>
            <Show when={index() > 0}>
              <div
                class={`${styles.stepConnector} ${getStepState(index()) !== 'pending' ? styles.completed : ''}`}
              />
            </Show>
            <div class={styles.step}>
              <span
                class={`${styles.stepDot} ${styles[getStepState(index())] ?? ''}`}
              >
                <Show
                  when={getStepState(index()) === 'completed'}
                  fallback={index() + 1}
                >
                  <FiCheck />
                </Show>
              </span>
              <span
                class={`${styles.stepLabel} ${styles[getStepState(index())] ?? ''}`}
              >
                {step.label}
              </span>
            </div>
          </>
        )}
      </For>
    </div>
  );
};

export default Stepper;
