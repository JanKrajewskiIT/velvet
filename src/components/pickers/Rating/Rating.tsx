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
  const selectedIndex = () => {
    if (props.value < 1) return 0;
    return Math.min(max(), Math.max(1, Math.round(props.value)));
  };

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

  const handleKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (!isInteractive()) return;

    const current = Number(event.currentTarget.dataset.index);
    if (!Number.isFinite(current)) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      props.onChange?.(Math.min(max(), current + 1));
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      props.onChange?.(Math.max(1, current - 1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      props.onChange?.(1);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      props.onChange?.(max());
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      props.onChange?.(current);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isInteractive()) setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    if (isInteractive()) setHoverIndex(-1);
  };

  return (
    <div class={classNames(styles.wrapper, props.class)} role="radiogroup" tabIndex={0} onMouseLeave={handleMouseLeave}>
      <For each={stars()}>
        {(index) => (
          <Dynamic
            component={isInteractive() ? 'button' : 'span'}
            data-index={String(index)}
            type={isInteractive() ? 'button' : undefined}
            role="radio"
            aria-checked={selectedIndex() === index}
            aria-label={`${index} of ${max()}`}
            tabIndex={
              isInteractive()
                ? selectedIndex() === index || (selectedIndex() === 0 && index === 1)
                  ? 0
                  : -1
                : undefined
            }
            class={classNames(
              styles.star,
              sizeClass(),
              isFilled(index) && styles.filled,
              isHalf(index) && styles.half,
              isInteractive() && styles.interactive
            )}
            onClick={isInteractive() ? () => handleClick(index) : undefined}
            onMouseEnter={isInteractive() ? () => handleMouseEnter(index) : undefined}
            onKeyDown={isInteractive() ? handleKeyDown : undefined}
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
