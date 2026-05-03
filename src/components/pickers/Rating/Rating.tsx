import { FiStar } from 'solid-icons/fi';
import { createMemo, createSignal, For, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Rating.module.css';

export interface RatingProps extends Omit<DivCoreNativeProps, 'onChange'> {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  icon?: JSX.Element;
  getValueLabel?: (index: number, max: number) => string;
}

const Rating = (props: Props<RatingProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['value', 'onChange', 'max', 'size', 'icon', 'getValueLabel', 'class']);
  const [hoverIndex, setHoverIndex] = createSignal(-1);
  const itemRefs: (HTMLButtonElement | undefined)[] = [];

  const max = () => local.max ?? 5;
  const sizeClassMap = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg } as const;
  const sizeClass = () => sizeClassMap[local.size ?? 'md'];
  const isInteractive = () => Boolean(local.onChange);
  const stars = createMemo(() => Array.from({ length: max() }, (_, i) => i + 1));

  const selectedIndex = () => {
    if (local.value < 1) return 0;
    return Math.min(max(), Math.max(1, Math.round(local.value)));
  };

  const tabStopIndex = createMemo(() => {
    const selected = selectedIndex();
    return selected > 0 ? selected : 1;
  });

  const fillPercent = (index: number) => {
    if (isInteractive() && hoverIndex() >= 0) {
      return index <= hoverIndex() ? 100 : 0;
    }
    const relative = local.value - (index - 1);
    return Math.max(0, Math.min(100, relative * 100));
  };

  const isFilled = (index: number) => fillPercent(index) >= 100;

  const isPartiallyFilled = (index: number) => {
    const fill = fillPercent(index);
    return fill > 0 && fill < 100;
  };

  const handleClick = (index: number) => {
    local.onChange?.(index);
    itemRefs[index - 1]?.focus();
  };

  const handleKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (!isInteractive()) return;

    const current = Number(event.currentTarget.dataset.index);
    if (!Number.isFinite(current)) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      handleClick(Math.min(max(), current + 1));
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      handleClick(Math.max(1, current - 1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      handleClick(1);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      handleClick(max());
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleClick(current);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isInteractive()) setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    if (isInteractive()) setHoverIndex(-1);
  };

  return (
    <div
      {...rest}
      class={classNames(styles.wrapper, local.class)}
      role={isInteractive() ? 'radiogroup' : undefined}
      onMouseLeave={handleMouseLeave}
    >
      <For each={stars()}>
        {(index, loopIndex) => (
          <Dynamic
            component={isInteractive() ? 'button' : 'span'}
            data-index={String(index)}
            type={isInteractive() ? 'button' : undefined}
            role={isInteractive() ? 'radio' : undefined}
            aria-checked={isInteractive() ? selectedIndex() === index : undefined}
            aria-label={local.getValueLabel?.(index, max()) ?? ts('rating.valueOf', { index, max: max() })}
            tabIndex={isInteractive() ? (tabStopIndex() === index ? 0 : -1) : undefined}
            ref={(element: HTMLButtonElement | HTMLSpanElement) => {
              if (!isInteractive()) return;
              itemRefs[loopIndex()] = element as HTMLButtonElement;
            }}
            style={{ '--star-index': String(loopIndex()) }}
            class={classNames(
              styles.star,
              sizeClass(),
              isFilled(index) && styles.filled,
              isPartiallyFilled(index) && styles.partial,
              isInteractive() && styles.interactive,
            )}
            onClick={isInteractive() ? () => handleClick(index) : undefined}
            onMouseEnter={isInteractive() ? () => handleMouseEnter(index) : undefined}
            onKeyDown={isInteractive() ? handleKeyDown : undefined}
          >
            <span class={styles.iconBase}>{local.icon ?? <FiStar />}</span>
            <span class={styles.iconFill} style={{ '--fill-percent': `${fillPercent(index)}%` }}>
              {local.icon ?? <FiStar />}
            </span>
          </Dynamic>
        )}
      </For>
    </div>
  );
};

export default Rating;
