import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '~/models/Props';

import styles from './Tour.module.css';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  finishLabel?: string;
  skipLabel?: string;
}

const CARD_GAP = 12;

const computeCardPosition = (rect: DOMRect, placement: 'top' | 'bottom' | 'left' | 'right') => {
  switch (placement) {
    case 'top':
      return { top: `${rect.top - CARD_GAP}px`, left: `${rect.left}px`, transform: 'translateY(-100%)' };
    case 'bottom':
      return { top: `${rect.bottom + CARD_GAP}px`, left: `${rect.left}px`, transform: 'none' };
    case 'left':
      return { top: `${rect.top}px`, left: `${rect.left - CARD_GAP}px`, transform: 'translateX(-100%)' };
    case 'right':
      return { top: `${rect.top}px`, left: `${rect.right + CARD_GAP}px`, transform: 'none' };
  }
};

const Tour = (props: Props<TourProps>) => {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [spotlightStyle, setSpotlightStyle] = createSignal<Record<string, string>>({});
  const [cardStyle, setCardStyle] = createSignal<Record<string, string>>({});

  const nextLabel = () => props.nextLabel ?? 'Next';
  const prevLabel = () => props.prevLabel ?? 'Back';
  const finishLabel = () => props.finishLabel ?? 'Finish';
  const skipLabel = () => props.skipLabel ?? 'Skip';

  const isLastStep = () => currentStep() === props.steps.length - 1;

  const updatePosition = () => {
    const step = props.steps[currentStep()];
    if (!step) return;

    const el = document.querySelector(step.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const padding = 4;

    setSpotlightStyle({
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
    });

    const placement = step.placement ?? 'bottom';
    setCardStyle(computeCardPosition(rect, placement));
  };

  createEffect(() => {
    if (!props.open) {
      setCurrentStep(0);
      return;
    }

    currentStep();
    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    });
  });

  const handleNext = () => {
    if (isLastStep()) {
      props.onComplete?.();
      props.onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    props.onClose();
  };

  return (
    <Show when={props.open}>
      <Portal>
        <div class={`${styles.overlay} ${props.class ?? ''}`}>
          <div class={styles.spotlight} style={spotlightStyle()} />
          <div class={styles.card} style={cardStyle()}>
            <button class={styles.skip} onClick={handleSkip}>
              {skipLabel()}
            </button>
            <div class={styles.title}>{props.steps[currentStep()]?.title}</div>
            <div class={styles.content}>{props.steps[currentStep()]?.content}</div>
            <div class={styles.footer}>
              <span class={styles.steps}>
                {currentStep() + 1} / {props.steps.length}
              </span>
              <div class={styles.actions}>
                <Show when={currentStep() > 0}>
                  <button class={`${styles.btn} ${styles.btnGhost}`} onClick={handlePrev}>
                    {prevLabel()}
                  </button>
                </Show>
                <button class={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext}>
                  {isLastStep() ? finishLabel() : nextLabel()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Tour;
