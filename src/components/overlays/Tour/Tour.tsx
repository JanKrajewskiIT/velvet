import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import Button from '~/components/buttons/Button/Button';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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

const VIEWPORT_PADDING = 16;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const computeCardPosition = (
  rect: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right',
  cardWidth: number,
  cardHeight: number
) => {
  switch (placement) {
    case 'top':
      return { top: rect.top - VIEWPORT_PADDING - cardHeight, left: rect.left };
    case 'bottom':
      return { top: rect.bottom + VIEWPORT_PADDING, left: rect.left };
    case 'left':
      return { top: rect.top, left: rect.left - VIEWPORT_PADDING - cardWidth };
    case 'right':
      return { top: rect.top, left: rect.right + VIEWPORT_PADDING };
  }
};

const Tour = (props: Props<TourProps>) => {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [spotlightStyle, setSpotlightStyle] = createSignal<Record<string, string>>({});
  const [cardStyle, setCardStyle] = createSignal<Record<string, string>>({});
  let cardRef: HTMLDivElement | undefined;

  const nextLabel = () => props.nextLabel ?? 'Next';
  const prevLabel = () => props.prevLabel ?? 'Back';
  const finishLabel = () => props.finishLabel ?? 'Finish';
  const skipLabel = () => props.skipLabel ?? 'Skip';

  const isLastStep = () => currentStep() === props.steps.length - 1;

  useEscapeKey(
    () => props.open,
    () => props.onClose()
  );

  const updatePosition = () => {
    const step = props.steps[currentStep()];
    if (!step) return;

    const el = document.querySelector(step.target);
    if (!el) {
      setSpotlightStyle({});
      setCardStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      return;
    }

    const rect = el.getBoundingClientRect();
    const padding = 4;
    const cardWidth = cardRef?.offsetWidth ?? 320;
    const cardHeight = cardRef?.offsetHeight ?? 220;

    setSpotlightStyle({
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
    });

    const placement = step.placement ?? 'bottom';
    const position = computeCardPosition(rect, placement, cardWidth, cardHeight);
    const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - cardWidth - VIEWPORT_PADDING);
    const maxTop = Math.max(VIEWPORT_PADDING, window.innerHeight - cardHeight - VIEWPORT_PADDING);

    setCardStyle({
      top: `${Math.round(clamp(position.top, VIEWPORT_PADDING, maxTop))}px`,
      left: `${Math.round(clamp(position.left, VIEWPORT_PADDING, maxLeft))}px`,
      transform: 'none',
    });
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
        <div class={classNames(styles.overlay, props.class)}>
          <div class={styles.spotlight} style={spotlightStyle()} />
          <div ref={cardRef} class={styles.card} style={cardStyle()}>
            <Button variant="ghost" size="sm" class={styles.skip} onClick={handleSkip}>
              {skipLabel()}
            </Button>
            <Heading as="h3" variant="titleMd" class={styles.title}>
              {props.steps[currentStep()]?.title}
            </Heading>
            <Text as="p" variant="bodySm" tone="muted" class={styles.content}>
              {props.steps[currentStep()]?.content}
            </Text>
            <div class={styles.footer}>
              <Text as="span" variant="caption" tone="muted" class={styles.steps}>
                {currentStep() + 1} / {props.steps.length}
              </Text>
              <div class={styles.actions}>
                <Show when={currentStep() > 0}>
                  <Button variant="ghost" size="sm" onClick={handlePrev}>
                    {prevLabel()}
                  </Button>
                </Show>
                <Button variant="primary" size="sm" onClick={handleNext}>
                  {isLastStep() ? finishLabel() : nextLabel()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Tour;
