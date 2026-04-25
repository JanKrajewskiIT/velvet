import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import FlipCard from '~/components/surfaces/FlipCard/FlipCard';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FlashcardPracticeCard.module.css';

interface FlashcardPracticeCardProps {
  front: JSX.Element;
  back: JSX.Element;
  badgeLabel?: string;
  badgeVariant?: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  height?: string;
}

const FlashcardPracticeCard = (props: Props<FlashcardPracticeCardProps>) => {
  const { ts } = useI18n();

  return (
    <FlipCard
      class={classNames(styles.card, props.class)}
      isFlipped={props.flipped}
      onFlip={props.onFlip}
      width="100%"
      height={props.height ?? '18.75rem'}
      frontClass={classNames(styles.face, styles.front)}
      backClass={classNames(styles.face, styles.back)}
      front={
        <>
          <Show when={props.badgeLabel}>
            {(label) => (
              <Chip class={styles.badge} label={label()} size="sm" variant={props.badgeVariant ?? 'subtle'} />
            )}
          </Show>
          <div class={styles.frontContent}>{props.front}</div>
          <Text as="span" variant="caption" tone="muted" class={styles.hint}>
            {ts('flashcard.revealHint')}
          </Text>
        </>
      }
      back={
        <>
          <Text as="span" variant="overline" tone="secondary">
            {ts('flashcard.answer')}
          </Text>
          <div class={styles.backContent}>{props.back}</div>
        </>
      }
    />
  );
};

export type { FlashcardPracticeCardProps };
export default FlashcardPracticeCard;
