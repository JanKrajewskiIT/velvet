import { createSignal, JSX, splitProps } from 'solid-js';

import styles from './FlipCard.module.css';

export interface FlipCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  front: JSX.Element;
  back: JSX.Element;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  width?: string;
  height?: string;
}

export const FlipCard = (props: FlipCardProps) => {
  const [local, rest] = splitProps(props, [
    'front',
    'back',
    'isFlipped',
    'onFlip',
    'width',
    'height',
    'class',
  ]);
  const [internalFlipped, setInternalFlipped] = createSignal(false);

  const isFlipped = () =>
    local.isFlipped !== undefined ? local.isFlipped : internalFlipped();

  const handleFlip = () => {
    const newValue = !isFlipped();
    if (local.isFlipped === undefined) {
      setInternalFlipped(newValue);
    }
    if (local.onFlip) {
      local.onFlip(newValue);
    }
  };

  return (
    <div
      class={`${styles.flipCard} ${local.class || ''}`}
      style={{
        width: local.width || '100%',
        height: local.height || '200px',
      }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      {...rest}
    >
      <div
        class={styles.flipCardInner}
        style={{ transform: isFlipped() ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div class={styles.flipCardFront}>{local.front}</div>
        <div class={styles.flipCardBack}>{local.back}</div>
      </div>
    </div>
  );
};
