import { FiCheck } from 'solid-icons/fi';
import { For, Show } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
  const activeIndex = () => props.steps.findIndex((s) => s.value === props.activeStep);

  const getStepState = (index: number) => {
    const current = activeIndex();
    if (index < current) return 'completed';
    if (index === current) return 'active';
    return 'pending';
  };

  const stepStateClass = (index: number) => styles[getStepState(index)] ?? '';
  const isStepCompleted = (index: number) => getStepState(index) === 'completed';
  const isConnectorCompleted = (index: number) => getStepState(index) !== 'pending';

  const labelTone = (index: number) => {
    const state = getStepState(index);
    if (state === 'active') return 'primary' as const;
    if (state === 'completed') return 'default' as const;
    return 'muted' as const;
  };

  return (
    <div class={classNames(styles.stepIndicator, props.class)} role="list">
      <For each={props.steps}>
        {(step, index) => (
          <>
            <Show when={index() > 0}>
              <div class={classNames(styles.stepConnector, isConnectorCompleted(index()) && styles.completed)} />
            </Show>
            <div class={styles.step} role="listitem">
              <span class={classNames(styles.stepDot, stepStateClass(index()))}>
                <Show when={isStepCompleted(index())} fallback={index() + 1}>
                  <FiCheck />
                </Show>
              </span>
              <Text as="span" variant="bodySm" tone={labelTone(index())} class={styles.stepLabel}>
                {step.label}
              </Text>
            </div>
          </>
        )}
      </For>
    </div>
  );
};

export default Stepper;
