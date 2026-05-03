import { batch, createEffect, createMemo, createSignal, type JSX, on, onCleanup, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import Button from '~/components/buttons/Button/Button';
import Floating from '~/components/overlays/Floating/Floating';
import Surface from '~/components/surfaces/Surface/Surface';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import arrow from '~/utils/floating/middleware/arrow';
import type { Placement, ReferenceElement } from '~/utils/floating/types';

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
}

const SPOTLIGHT_PADDING = 4;
const TOUR_OFFSET = 16;

const placementByValue: Record<NonNullable<TourStep['placement']>, Placement> = {
  top: 'top-start',
  bottom: 'bottom-start',
  left: 'left-start',
  right: 'right-start',
};

const Tour = (props: Props<TourProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['steps', 'open', 'onClose', 'onComplete', 'class']);
  const [currentStep, setCurrentStep] = createSignal(0);
  const [targetEl, setTargetEl] = createSignal<HTMLElement | undefined>(undefined);
  const [spotlightStyle, setSpotlightStyle] = createSignal<JSX.CSSProperties>({});
  const [arrowRef, setArrowRef] = createSignal<HTMLSpanElement | undefined>(undefined);

  const currentStepData = createMemo(() => local.steps[currentStep()]);
  const isLastStep = createMemo(() => currentStep() === local.steps.length - 1);

  useEscapeKey(
    () => local.open,
    () => local.onClose(),
  );

  const updateSpotlight = (el: HTMLElement | undefined): void => {
    if (!el) {
      setSpotlightStyle({});
      return;
    }
    const rect = el.getBoundingClientRect();
    setSpotlightStyle({
      '--tour-spotlight-top': `${rect.top - SPOTLIGHT_PADDING}px`,
      '--tour-spotlight-left': `${rect.left - SPOTLIGHT_PADDING}px`,
      '--tour-spotlight-width': `${rect.width + SPOTLIGHT_PADDING * 2}px`,
      '--tour-spotlight-height': `${rect.height + SPOTLIGHT_PADDING * 2}px`,
    });
  };

  // Resolve target element + spotlight position whenever the step changes or layout updates.
  createEffect(
    on(
      () => [local.open, currentStepData()?.target],
      () => {
        if (!local.open) return;
        const step = currentStepData();
        if (!step) return;
        const el = document.querySelector(step.target);
        const target = el instanceof HTMLElement ? el : undefined;
        batch(() => {
          setTargetEl(target);
          updateSpotlight(target);
        });
      },
    ),
  );

  // Keep spotlight + floating card in sync with viewport changes.
  createEffect(() => {
    if (!local.open) return;
    const target = targetEl();
    if (!target) return;
    let rafId: number | undefined;
    const scheduleUpdate = (): void => {
      if (rafId !== undefined) return;
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        updateSpotlight(target);
      });
    };
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);
    onCleanup(() => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
    });
  });

  // Reset to first step when re-opened.
  createEffect(
    on(
      () => local.open,
      (open) => {
        if (!open) setCurrentStep(0);
      },
      { defer: true },
    ),
  );

  const placement = createMemo<Placement>(() => placementByValue[currentStepData()?.placement ?? 'bottom']);
  const middleware = () => [arrow({ element: () => arrowRef() })];

  // Floating expects a ReferenceElement accessor; targetEl satisfies HTMLElement which is a ReferenceElement.
  const referenceAccessor = (): ReferenceElement | undefined => targetEl();

  const handleNext = (): void => {
    if (isLastStep()) {
      local.onComplete?.();
      local.onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = (): void => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = (): void => {
    local.onClose();
  };

  return (
    <Show when={local.open}>
      <Portal>
        <div {...rest} class={classNames(styles.overlay, local.class)}>
          <div class={styles.spotlight} style={spotlightStyle()} />
        </div>
      </Portal>
      <Floating
        anchor={referenceAccessor}
        open={local.open && Boolean(targetEl())}
        placement={placement()}
        offset={TOUR_OFFSET}
        padding={16}
        animationFrame
        extraMiddleware={middleware()}
        class={styles.floatingHost}
      >
        <Surface class={styles.card} elevation="popover">
          <Button variant="ghost" size="sm" class={styles.skip} onClick={handleSkip}>
            {ts('common.skip')}
          </Button>
          <Heading as="h3" variant="titleMd" class={styles.title}>
            {currentStepData()?.title}
          </Heading>
          <Text as="p" variant="bodySm" tone="muted" class={styles.content}>
            {currentStepData()?.content}
          </Text>
          <div class={styles.footer}>
            <Text as="span" variant="caption" tone="muted" class={styles.steps}>
              {currentStep() + 1} / {local.steps.length}
            </Text>
            <div class={styles.actions}>
              <Show when={currentStep() > 0}>
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  {ts('common.back')}
                </Button>
              </Show>
              <Button variant="primary" size="sm" onClick={handleNext}>
                {isLastStep() ? ts('common.finish') : ts('common.next')}
              </Button>
            </div>
          </div>
          <span ref={setArrowRef} class={styles.arrow} aria-hidden="true" />
        </Surface>
      </Floating>
    </Show>
  );
};

export default Tour;
