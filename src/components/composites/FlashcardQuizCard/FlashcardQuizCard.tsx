import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import FlipCard from '~/components/surfaces/FlipCard/FlipCard';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FlashcardQuizCard.module.css';

interface FlashcardQuizCardProps {
  front: JSX.Element;
  back: JSX.Element;
  badgeLabel?: string;
  badgeVariant?: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  height?: string;
  revealHintLabel?: string;
  answerLabel?: string;
}

const FlashcardQuizCard = (props: Props<FlashcardQuizCardProps>) => {
  return (
    <FlipCard
      class={classNames(styles.card, props.class)}
      isFlipped={props.flipped}
      onFlip={props.onFlip}
      width="100%"
      height={props.height ?? '18.75rem'}
      front={
        <div class={classNames(styles.face, styles.front)}>
          <Show when={props.badgeLabel}>
            {(label) => (
              <Chip class={styles.badge} label={label()} size="sm" variant={props.badgeVariant ?? 'subtle'} />
            )}
          </Show>
          <div class={styles.frontContent}>{props.front}</div>
          <Show when={props.revealHintLabel}>
            {(label) => (
              <Text as="span" variant="caption" tone="muted" class={styles.hint}>
                {label()}
              </Text>
            )}
          </Show>
        </div>
      }
      back={
        <div class={classNames(styles.face, styles.back)}>
          <Show when={props.answerLabel}>
            {(label) => (
              <div class={styles.backHeader}>
                <Text as="span" variant="overline" tone="secondary">
                  {label()}
                </Text>
              </div>
            )}
          </Show>
          <div class={styles.backContent}>{props.back}</div>
        </div>
      }
    />
  );
};

export type { FlashcardQuizCardProps };
export default FlashcardQuizCard;
