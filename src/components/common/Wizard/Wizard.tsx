import { createMemo, createSignal, For, JSX, Show, splitProps } from 'solid-js';

import { Button } from '../Button/Button';
import { Stepper } from '../Stepper/Stepper';
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
}

export const Wizard = (props: WizardProps) => {
  const [local, rest] = splitProps(props, [
    'steps',
    'onFinish',
    'onStepChange',
    'initialStep',
    'class',
  ]);
  const [currentStep, setCurrentStep] = createSignal(local.initialStep || 0);
  const [isLoading, setIsLoading] = createSignal(false);

  const isLastStep = createMemo(() => currentStep() === local.steps.length - 1);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const step = local.steps[currentStep()];
      if (step.validate) {
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
    <div class={`${styles.wizard} ${local.class || ''}`} {...rest}>
      <div class={styles.stepperContainer}>
        <Stepper
          steps={local.steps.map((s) => s.label)}
          currentStep={currentStep()}
        />
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
          variant="secondary"
          disabled={currentStep() === 0 || isLoading()}
          onClick={handleBack}
        >
          Wstecz
        </Button>
        <Button
          variant="primary"
          disabled={isLoading()}
          onClick={handleNext}
          loading={isLoading()}
        >
          {isLastStep() ? 'Zakończ' : 'Dalej'}
        </Button>
      </div>
    </div>
  );
};
