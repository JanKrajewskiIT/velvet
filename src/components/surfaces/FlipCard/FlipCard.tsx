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
  frontClass?: string;
  backClass?: string;
}

const FlipCard = (props: Props<FlipCardOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'front',
    'back',
    'isFlipped',
    'onFlip',
    'width',
    'height',
    'axis',
    'class',
    'frontClass',
    'backClass',
  ]);
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

  const cardStyle = createMemo<JSX.CSSProperties>(() => {
    const style: JSX.CSSProperties = {};
    if (local.width) style['--flip-card-width'] = local.width;
    if (local.height) style['--flip-card-height'] = local.height;
    return style;
  });

  return (
    <div
      class={classNames(styles.flipCard, local.axis === 'horizontal' && styles.horizontal, local.class)}
      style={cardStyle()}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      {...rest}
    >
      <div class={classNames(styles.flipCardInner, isFlipped() && styles.flipped)}>
        <div class={classNames(styles.flipCardFront, local.frontClass ? local.frontClass : styles.defaultFace)}>
          {local.front}
        </div>
        <div class={classNames(styles.flipCardBack, local.backClass ? local.backClass : styles.defaultFace)}>
          {local.back}
        </div>
      </div>
    </div>
  );
};

export type { FlipAxis };
export default FlipCard;
