import { createMemo, createSignal, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FlipCard.module.css';

type FlipAxis = 'vertical' | 'horizontal';

interface FlipCardOwnProps extends DivCoreNativeProps {
  front: JSX.Element;
  back: JSX.Element;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  width?: string;
  height?: string;
  axis?: FlipAxis;
}

const FlipCard = (props: Props<FlipCardOwnProps>) => {
  const [local, rest] = splitProps(props, ['front', 'back', 'isFlipped', 'onFlip', 'width', 'height', 'axis', 'class']);
  const [internalFlipped, setInternalFlipped] = createSignal(false);

  const isFlipped = createMemo(() => (local.isFlipped !== undefined ? local.isFlipped : internalFlipped()));

  const handleFlip = () => {
    const newValue = !isFlipped();
    if (local.isFlipped === undefined) {
      setInternalFlipped(newValue);
    }
    if (local.onFlip) {
      local.onFlip(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      class={classNames(styles.flipCard, local.axis === 'horizontal' && styles.horizontal, local.class)}
      style={{ width: local.width || '100%', height: local.height || '200px' }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      {...rest}
    >
      <div class={classNames(styles.flipCardInner, isFlipped() && styles.flipped)}>
        <div class={styles.flipCardFront}>{local.front}</div>
        <div class={styles.flipCardBack}>{local.back}</div>
      </div>
    </div>
  );
};

export type { FlipAxis };
export default FlipCard;
