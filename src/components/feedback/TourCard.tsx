import { createEffect, createSignal, For, onCleanup, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { placeFloating } from '../../utils/floating';
import { Button } from '../actions/Button';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './TourCard.module.css';
import type { CardSide, ResolvedTourProps, TourStep } from './tourTypes';

interface CardPosition {
  left: number;
  top: number;
  side: CardSide;
}

const VIEWPORT_MARGIN_PX = 8;
const CARD_GAP_PX = 12;

const placeCard = (
  rect: DOMRect | undefined,
  card: DOMRect,
  padding: number,
  side: TourStep['placement'] = 'bottom',
): CardPosition => {
  const viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
  if (!rect)
    return {
      left: Math.max(VIEWPORT_MARGIN_PX, (viewport.width - card.width) / 2),
      top: Math.max(VIEWPORT_MARGIN_PX, (viewport.height - card.height) / 2),
      side: 'center',
    };
  const position = placeFloating(rect, card, viewport, {
    side,
    align: 'center',
    offset: CARD_GAP_PX + padding,
    padding: VIEWPORT_MARGIN_PX,
  });
  return { left: position.x, top: position.y, side: position.side };
};
interface TourCardProps {
  tour: ResolvedTourProps;
  index: number;
  step: TourStep;
  rect: DOMRect | undefined;
  titleId: string;
  bodyId: string;
  onBack: () => void;
  onNext: () => void;
}

/** One step's card; re-created per step so it re-animates and takes focus. */
export const TourCard = (props: TourCardProps) => {
  const translate = useTranslate();
  const [card, setCard] = createSignal<HTMLElement>();
  const [position, setPosition] = createSignal<CardPosition>({ left: 0, top: 0, side: 'bottom' });
  const last = () => props.index === props.tour.steps.length - 1;
  const nextLabel = () => props.tour.nextLabel ?? translate('velvet.common.next');
  const doneLabel = () => props.tour.doneLabel ?? translate('velvet.feedback.tour.done');

  createEffect(() => {
    const initialCard = card();
    if (!initialCard) return;
    const rect = props.rect;
    const padding = props.tour.padding;
    const side = props.step.placement;
    const measure = () => setPosition(placeCard(rect, initialCard.getBoundingClientRect(), padding, side));
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(initialCard);
    onCleanup(() => observer?.disconnect());
  });
  createEffect(() => card()?.focus({ preventScroll: true }));

  return (
    <div
      ref={setCard}
      tabIndex={-1}
      class={cx(styles.tourPartCard, `vui-tour__card--${position().side}`)}
      style={{ left: `${position().left}px`, top: `${position().top}px` }}
    >
      <div class={styles.tourPartTop}>
        <Text as="span" variant="kbd" tone="brand" class="vui-tour__step">
          {props.index + 1} / {props.tour.steps.length}
        </Text>
        <Button variant="ghost" size="sm" onClick={() => props.tour.onClose?.()}>
          {props.tour.skipLabel ?? translate('velvet.common.skip')}
        </Button>
      </div>
      <Text as="div" variant="title" id={props.titleId} class="vui-tour__title">
        {props.step.title}
      </Text>
      <Text as="div" variant="body-sm" tone="secondary" id={props.bodyId} class={styles.tourPartBody}>
        {props.step.body}
      </Text>
      <Show when={props.step.target && !props.rect}>
        <Text as="div" variant="caption" tone="tertiary" class={styles.tourPartMissing}>
          <Glyph name="info" />
          {props.tour.missingLabel ?? translate('velvet.feedback.tour.missing')}
        </Text>
      </Show>
      <div class={styles.tourPartFoot}>
        <span class={styles.tourPartDots} aria-hidden="true">
          <For each={props.tour.steps}>{(_, k) => <i class={k() === props.index ? styles.on : ''} />}</For>
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
