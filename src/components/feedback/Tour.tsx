import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  type JSX,
  mergeProps,
  on,
  onCleanup,
  Show,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { Button } from '../actions/Button';
import { Glyph } from '../primitives/Glyph';
import { createModalRoot } from './createModalRoot';

const CARD_GAP = 12;
const VIEWPORT_MARGIN = 8;

type TourPlacement = 'bottom' | 'top' | 'left' | 'right';
type CardSide = TourPlacement | 'center';

export interface TourStep {
  /** CSS selector, element, or accessor of the element to spotlight. Omit for a centred intro step. */
  target?: string | HTMLElement | (() => HTMLElement | undefined);
  title: JSX.Element;
  body?: JSX.Element;
  /** Preferred side; flips when there's no room. @default 'bottom' */
  placement?: TourPlacement;
}

export interface TourProps {
  steps: TourStep[];
  open: boolean;
  /** Skip, Escape. */
  onClose?: () => void;
  /** Last step "Done" — defaults to onClose. */
  onFinish?: () => void;
  /** @default 0 */
  defaultStep?: number;
  /** Spotlight padding px. @default 6 */
  padding?: number;
  /** @default localized "Skip" */
  skipLabel?: string;
  /** @default localized "Back" */
  backLabel?: string;
  /** @default localized "Next" */
  nextLabel?: string;
  /** @default localized "Done" */
  doneLabel?: string;
  /** Shown when the step's target is not in the page. @default localized "This part of the page isn’t visible right now." */
  missingLabel?: string;
}

type ResolvedTourProps = TourProps & Required<Pick<TourProps, 'defaultStep' | 'padding'>>;

interface CardPosition {
  left: number;
  top: number;
  side: CardSide;
}

const resolveTarget = (target: TourStep['target']): HTMLElement | undefined => {
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? undefined;
  return typeof target === 'function' ? target() : target;
};

const placeCard = (
  rect: DOMRect | undefined,
  card: DOMRect,
  preferred: TourPlacement,
  padding: number,
): CardPosition => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!rect) return { left: (vw - card.width) / 2, top: (vh - card.height) / 2, side: 'center' };
  let side = preferred;
  if (side === 'bottom' && rect.bottom + CARD_GAP + card.height > vh) side = 'top';
  else if (side === 'top' && rect.top - CARD_GAP - card.height < 0) side = 'bottom';
  const centeredX = rect.left + rect.width / 2 - card.width / 2;
  const centeredY = rect.top + rect.height / 2 - card.height / 2;
  const left =
    side === 'right'
      ? rect.right + CARD_GAP + padding
      : side === 'left'
        ? rect.left - CARD_GAP - card.width - padding
        : centeredX;
  const top =
    side === 'bottom'
      ? rect.bottom + CARD_GAP + padding
      : side === 'top'
        ? rect.top - CARD_GAP - card.height - padding
        : centeredY;
  return {
    left: clamp(left, VIEWPORT_MARGIN, vw - card.width - VIEWPORT_MARGIN),
    top: clamp(top, VIEWPORT_MARGIN, vh - card.height - VIEWPORT_MARGIN),
    side,
  };
};

interface TourCardProps {
  tour: ResolvedTourProps;
  index: number;
  step: TourStep;
  rect: DOMRect | undefined;
  onBack: () => void;
  onNext: () => void;
}

/** One step's card; re-created per step so it re-animates and takes focus. */
const TourCard = (props: TourCardProps) => {
  const translate = useTranslate();
  const titleId = createUniqueId();
  const bodyId = createUniqueId();
  const [card, setCard] = createSignal<HTMLElement>();
  const [position, setPosition] = createSignal<CardPosition>({ left: 0, top: 0, side: 'bottom' });
  const last = () => props.index === props.tour.steps.length - 1;
  const nextLabel = () => props.tour.nextLabel ?? translate('velvet.common.next');
  const doneLabel = () => props.tour.doneLabel ?? translate('velvet.feedback.tour.done');

  createEffect(() => {
    const el = card();
    if (!el) return;
    setPosition(
      placeCard(props.rect, el.getBoundingClientRect(), props.step.placement ?? 'bottom', props.tour.padding),
    );
  });
  createEffect(() => card()?.focus({ preventScroll: true }));

  return (
    <div
      ref={setCard}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      class={cx('vui-tour__card', `vui-tour__card--${position().side}`)}
      style={{ left: `${position().left}px`, top: `${position().top}px` }}
    >
      <div class="vui-tour__top">
        <span class="vui-tour__step">
          {props.index + 1} / {props.tour.steps.length}
        </span>
        <Button variant="ghost" size="sm" onClick={() => props.tour.onClose?.()}>
          {props.tour.skipLabel ?? translate('velvet.common.skip')}
        </Button>
      </div>
      <div id={titleId} class="vui-tour__title">
        {props.step.title}
      </div>
      <div id={bodyId} class="vui-tour__body">
        {props.step.body}
      </div>
      <Show when={props.step.target && !props.rect}>
        <div class="vui-tour__missing">
          <Glyph name="info" />
          {props.tour.missingLabel ?? translate('velvet.feedback.tour.missing')}
        </div>
      </Show>
      <div class="vui-tour__foot">
        <span class="vui-tour__dots" aria-hidden="true">
          <For each={props.tour.steps}>{(_, k) => <i class={k() === props.index ? 'on' : ''} />}</For>
        </span>
        <Show when={props.index > 0}>
          <Button variant="secondary" size="sm" onClick={props.onBack}>
            {props.tour.backLabel ?? translate('velvet.common.back')}
          </Button>
        </Show>
        <Button size="sm" onClick={props.onNext}>
          {last() ? doneLabel() : nextLabel()}
        </Button>
      </div>
    </div>
  );
};

/** Guided walkthrough: dims the page, spotlights one element, floats a step card beside it. ← → navigate, Esc skips. Keep it to 3–5 steps; the page behind is inert while open. */
export const Tour = (props: TourProps) => {
  const p = mergeProps({ defaultStep: 0, padding: 6 } satisfies Partial<TourProps>, props);
  const [index, setIndex] = createSignal(p.defaultStep);
  const [rect, setRect] = createSignal<DOMRect>();
  const current = createMemo(() => {
    const step = p.steps[index()];
    return step && { index: index(), step };
  });
  const ref = createModalRoot(() => p.open, { onEscape: () => p.onClose?.(), initialFocus: '.vui-tour__card' });

  createEffect(
    on(
      () => p.open,
      (open) => open && setIndex(p.defaultStep),
    ),
  );

  const next = () => {
    if (index() >= p.steps.length - 1) (p.onFinish ?? p.onClose)?.();
    else setIndex(index() + 1);
  };
  const back = () => setIndex(Math.max(0, index() - 1));

  createEffect(() => {
    if (!p.open) return;
    const measure = () => {
      const step = current()?.step;
      setRect(step ? resolveTarget(step.target)?.getBoundingClientRect() : undefined);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('keydown', onKeyDown);
    });
  });

  const hole = (): JSX.CSSProperties | undefined => {
    const r = rect();
    return (
      r && {
        left: `${r.left - p.padding}px`,
        top: `${r.top - p.padding}px`,
        width: `${r.width + p.padding * 2}px`,
        height: `${r.height + p.padding * 2}px`,
      }
    );
  };

  return (
    <Show when={p.open && current()}>
      <Portal>
        <div ref={ref} class="vui-tour" role="presentation">
          <Show when={hole()} fallback={<div class="vui-tour__veil" />}>
            {(style) => <div class="vui-tour__hole" style={style()} />}
          </Show>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer-only shield that keeps focus on the step card; keyboard control is on the window and createModal */}
          <div class="vui-tour__block" onMouseDown={(e) => e.preventDefault()} />
          <Show when={current()} keyed>
            {(active) => (
              <TourCard tour={p} index={active.index} step={active.step} rect={rect()} onBack={back} onNext={next} />
            )}
          </Show>
        </div>
      </Portal>
    </Show>
  );
};
