import {
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
} from 'solid-js';

import Button from '../../actions-and-forms/Button/Button';
import Stepper from '../../data-display/Stepper/Stepper';
import styles from './Wizard.module.css';

export interface WizardStep {
  label: string;
  component: JSX.Element;
  validate?: () => boolean | Promise<boolean>;
}

export interface WizardProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'onFinish'
> {
  steps: WizardStep[];
  onFinish: () => void | Promise<void>;
  onStepChange?: (step: number) => void;
  initialStep?: number;
  backLabel: string;
  nextLabel: string;
  finishLabel: string;
}

export const Wizard = (props: WizardProps) => {
  const [local, rest] = splitProps(props, [
    'steps',
    'onFinish',
    'onStepChange',
    'initialStep',
    'class',
    'backLabel',
    'nextLabel',
    'finishLabel',
  ]);
  const [currentStep, setCurrentStep] = createSignal(local.initialStep ?? 0);
  const [isLoading, setIsLoading] = createSignal(false);

  const isLastStep = createMemo(() => currentStep() === local.steps.length - 1);

  const stepperSteps = () =>
    local.steps.map((s, i) => ({
      value: String(i),
      label: s.label,
    }));

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const step = local.steps[currentStep()];
      if (step?.validate) {
        const isValid = await step.validate();
        if (!isValid) return;
      }

      if (isLastStep()) {
        await local.onFinish();
      } else {
        const next = currentStep() + 1;
        setCurrentStep(next);
        local.onStepChange?.(next);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep() > 0) {
      const prev = currentStep() - 1;
      setCurrentStep(prev);
      local.onStepChange?.(prev);
    }
  };

  return (
    <div class={`${styles.wizard} ${local.class ?? ''}`} {...rest}>
      <div class={styles.stepperContainer}>
        <Stepper steps={stepperSteps()} activeStep={String(currentStep())} />
      </div>
      <div class={styles.content}>
        <For each={local.steps}>
          {(step, index) => (
            <Show when={index() === currentStep()}>
              <div class={styles.stepContent}>{step.component}</div>
            </Show>
          )}
        </For>
      </div>
      <div class={styles.actions}>
        <Button
          variant="ghost"
          disabled={currentStep() === 0 || isLoading()}
          onClick={handleBack}
        >
          {local.backLabel}
        </Button>
        <Button
          variant="primary"
          disabled={isLoading()}
          onClick={handleNext}
          loading={isLoading()}
        >
          {isLastStep() ? local.finishLabel : local.nextLabel}
        </Button>
      </div>
    </div>
  );
};
