import { FiCheck } from 'solid-icons/fi';
import { createMemo, For, Show, splitProps } from 'solid-js';

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

type StepState = 'completed' | 'active' | 'pending';

const stepStateClassByValue: Record<StepState, string | undefined> = {
  completed: styles.completed,
  active: styles.active,
  pending: undefined,
};

const Stepper = (props: Props<StepperProps>) => {
  const [local, rest] = splitProps(props, ['steps', 'activeStep', 'class']);
  const activeIndex = createMemo(() => local.steps.findIndex((s) => s.value === local.activeStep));

  const getStepState = (index: number): StepState => {
    const current = activeIndex();
    if (index < current) return 'completed';
    if (index === current) return 'active';
    return 'pending';
  };

  const stepStateClass = (index: number) => stepStateClassByValue[getStepState(index)] ?? '';
  const isStepCompleted = (index: number) => getStepState(index) === 'completed';
  const isConnectorCompleted = (index: number) => getStepState(index) !== 'pending';

  const labelTone = (index: number) => {
    const state = getStepState(index);
    if (state === 'active') return 'primary' as const;
    if (state === 'completed') return 'default' as const;
    return 'muted' as const;
  };

  return (
    <div {...rest} class={classNames(styles.stepIndicator, local.class)} role="list">
      <For each={local.steps}>
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
