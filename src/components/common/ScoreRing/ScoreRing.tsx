import type Props from '../../../models/Props';
import styles from './ScoreRing.module.css';

interface ScoreRingProps {
  score: number;
}

const ScoreRing = (props: Props<ScoreRingProps>) => {
  const circumference = 2 * Math.PI * 40;
  const offset = () => circumference - (props.score / 100) * circumference;
  const color = () => {
    if (props.score >= 86) return 'var(--color-success)';
    if (props.score >= 71) return 'var(--color-primary)';
    if (props.score >= 51) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div
      class={`${styles.scoreRing} ${props.class ?? ''}`}
      style={{ '--ring-circumference': String(circumference) }}
    >
      <svg viewBox="0 0 100 100" class={styles.scoreSvg}>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-border)"
          stroke-width="8"
        />
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
          style={{ '--target-offset': String(offset()) }}
        />
      </svg>
      <span class={styles.scoreText} style={{ color: color() }}>
        {props.score}%
      </span>
    </div>
  );
};

export default ScoreRing;
