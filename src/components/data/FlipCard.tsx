import { type JSX, mergeProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Card, type CardProps } from '../display/Card';
import { cssLength } from './cssLength';
import styles from './FlipCard.module.css';

export interface FlipCardProps {
  front: JSX.Element;
  back: JSX.Element;
  flipped?: boolean;
  /** @default false */
  defaultFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** px or CSS length. @default 220 */
  height?: number | string;
  /** Accessible name of the toggle. @default localized "Flip card" */
  label?: string;
  /** Front face paint (Card/Surface variant). @default 'default' */
  variant?: CardProps['variant'];
  /** Back face paint. @default 'brand-solid' */
  backVariant?: CardProps['variant'];
  /** Front face hue + accent strip. */
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  /** px or CSS length; default fills the column. */
  width?: number | string;
  /** center = centred stack (vocab card) · start = left-aligned header / body / footer laid out top-to-bottom (Q&A, metric). @default 'center' */
  align?: 'center' | 'start';
  /** Also flip on pointer hover (click still toggles). @default false */
  flipOnHover?: boolean;
  class?: string;
}

/** Two-sided card that flips in 3D on click / Enter / Space (fades under reduced motion). Each face is a Card. */
export const FlipCard = (props: FlipCardProps) => {
  const merged = mergeProps(
    { height: 220, backVariant: 'brand-solid', align: 'center', flipOnHover: false } satisfies Partial<FlipCardProps>,
    props,
  );
  const translate = useTranslate();
  const label = () => merged.label ?? translate('velvet.data.flipCard.label');
  const [on, setOn] = createControllable<boolean>({
    value: () => props.flipped,
    defaultValue: props.defaultFlipped ?? false,
    onChange: (next) => props.onFlip?.(next),
  });

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setOn(!on());
  };

  return (
    <div
      role="button"
      tabIndex={0}
      class={cx(
        styles.flip,
        on() && styles.flipVariantOn,
        merged.align === 'start' && styles.flipVariantStart,
        merged.flipOnHover && styles.flipVariantHover,
        merged.class,
      )}
      style={{ height: cssLength(merged.height), width: cssLength(merged.width) }}
      aria-pressed={on()}
      aria-label={translate(on() ? 'velvet.data.flipCard.showingBack' : 'velvet.data.flipCard.showingFront', {
        label: label(),
      })}
      onClick={() => setOn(!on())}
      onKeyDown={onKeyDown}
    >
      <div class={styles.flipPartInner}>
        <Card
          variant={merged.variant}
          tone={merged.tone}
          accent={merged.accent}
          class={cx(styles.flipPartFace, styles.flipPartFaceVariantFront)}
          aria-hidden={on()}
          bodyClass={styles.cardBody}
        >
          {merged.front}
        </Card>
        <Card
          variant={merged.backVariant}
          class={cx(styles.flipPartFace, styles.flipPartFaceVariantBack)}
          aria-hidden={!on()}
          bodyClass={styles.cardBody}
        >
          {merged.back}
        </Card>
      </div>
    </div>
  );
};
