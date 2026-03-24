import { createMemo } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ScoreRing.module.css';

interface ScoreRingProps {
  score: number;
}

const ScoreRing = (props: Props<ScoreRingProps>) => {
  const circumference = 2 * Math.PI * 40;
  const normalized = createMemo(() => Math.min(100, Math.max(0, props.score)));
  const offset = createMemo(() => circumference - (normalized() / 100) * circumference);

  const color = createMemo(() => {
    if (normalized() >= 86) return 'var(--color-success)';
    if (normalized() >= 71) return 'var(--color-primary)';
    if (normalized() >= 51) return 'var(--color-warning)';
    return 'var(--color-error)';
  });

  return (
    <div
      class={classNames(styles.scoreRing, props.class)}
      role="meter"
      aria-valuenow={normalized()}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${normalized()}%`}
      style={{ '--ring-circumference': String(circumference), '--target-offset': String(offset()) }}
    >
      <svg viewBox="0 0 100 100" class={styles.scoreSvg}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" stroke-width="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color()}
          stroke-width="8"
          stroke-dasharray={String(circumference)}
          stroke-dashoffset={String(circumference)}
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
          class={styles.scoreCircle}
        />
      </svg>
      <Heading as="span" variant="titleLg" class={styles.scoreText} style={{ '--ring-color': color() }}>
        {normalized()}%
      </Heading>
    </div>
  );
};

export default ScoreRing;
