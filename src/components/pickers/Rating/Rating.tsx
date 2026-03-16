import { FiStar } from 'solid-icons/fi';
import { createSignal, For, type JSX, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Rating.module.css';

interface RatingOwnProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  icon?: JSX.Element;
}

const Rating = (props: Props<RatingOwnProps>) => {
  const [hoverIndex, setHoverIndex] = createSignal(-1);

  const max = () => props.max ?? 5;
  const sizeClassMap = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg } as const;
  const sizeClass = () => sizeClassMap[props.size ?? 'md'];
  const isInteractive = () => !!props.onChange;

  const stars = () => Array.from({ length: max() }, (_, i) => i + 1);

  const isFilled = (index: number) => {
    if (isInteractive() && hoverIndex() >= 0) {
      return index <= hoverIndex();
    }
    return index <= Math.floor(props.value);
  };

  const isHalf = (index: number) => {
    if (isInteractive() && hoverIndex() >= 0) return false;
    return !isFilled(index) && index - 0.5 <= props.value;
  };

  const handleClick = (index: number) => {
    props.onChange?.(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isInteractive()) setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    if (isInteractive()) setHoverIndex(-1);
  };

  return (
    <div
      class={`${styles.wrapper} ${props.class ?? ''}`}
      role="radiogroup"
      tabIndex={0}
      onMouseLeave={handleMouseLeave}
    >
      <For each={stars()}>
        {(index) => (
          <Dynamic
            component={isInteractive() ? 'button' : 'span'}
            type={isInteractive() ? 'button' : undefined}
            role="radio"
            aria-checked={index <= props.value}
            aria-label={`${index} of ${max()}`}
            class={classNames(
              styles.star,
              sizeClass(),
              isFilled(index) && styles.filled,
              isHalf(index) && styles.half,
              isInteractive() && styles.interactive
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <Show when={props.icon} fallback={<FiStar />}>
              {props.icon}
            </Show>
          </Dynamic>
        )}
      </For>
    </div>
  );
};

export default Rating;
