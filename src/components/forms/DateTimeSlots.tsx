import { createMemo, createSignal, For, type JSX } from 'solid-js';

import { createFrameFocus } from '../../hooks/createFrameFocus';
import { activeItemKey } from '../../utils/activeItem';
import { createTypeahead } from '../../utils/createTypeahead';
import { cx } from '../../utils/cx';
import { formatMinutes } from './time';

export interface DateTimeSlotsProps {
  slots: readonly number[];
  value: number | null;
  step: number;
  hour12: boolean;
  locale: string;
  label: string;
  isDisabled: (minutes: number) => boolean;
  onSelect: (minutes: number) => void;
  ref: (element: HTMLDivElement) => void;
}

export const DateTimeSlots = (props: DateTimeSlotsProps) => {
  let root!: HTMLDivElement;
  const [focused, setFocused] = createSignal<number>();
  const active = createMemo(() =>
    activeItemKey(
      props.slots,
      focused() ?? props.value ?? undefined,
      (minutes) => minutes,
      (minutes) => !props.isDisabled(minutes),
    ),
  );
  const focus = createFrameFocus(() => root, { preventScroll: false });
  const search = createTypeahead();
  const text = (minutes: number) => formatMinutes(minutes, props.hour12, props.locale);
  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.defaultPrevented) return;
    const enabled = props.slots.filter((minutes) => !props.isDisabled(minutes));
    if (!enabled.length) return;
    const at = enabled.findIndex((minutes) => minutes === active());
    let index: number;
    switch (event.key) {
      case 'ArrowDown':
        index = Math.min(enabled.length - 1, at + 1);
        break;
      case 'ArrowUp':
        index = Math.max(0, at - 1);
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = enabled.length - 1;
        break;
      default:
        if (event.key.length !== 1 || event.key === ' ' || event.ctrlKey || event.metaKey || event.altKey) return;
        index = search(event.key, enabled.map(text), at);
    }
    const minutes = enabled[index];
    if (minutes === undefined) return;
    event.preventDefault();
    setFocused(minutes);
    focus(`[data-time="${minutes}"]`);
  };
  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- listbox uses roving focus on its option buttons
    <div
      ref={(element) => {
        root = element;
        props.ref(element);
      }}
      class="vui-dtpop__list"
      role="listbox"
      aria-label={props.label}
      onKeyDown={onKeyDown}
    >
      <For each={props.slots}>
        {(minutes) => (
          <button
            type="button"
            role="option"
            data-time={minutes}
            tabIndex={minutes === active() ? 0 : -1}
            aria-selected={minutes === props.value}
            data-near={
              props.value !== null && minutes <= props.value && props.value < minutes + props.step ? 'true' : undefined
            }
            disabled={props.isDisabled(minutes)}
            class={cx('vui-dtpop__slot', minutes === props.value && 'vui-dtpop__slot--on')}
            onFocus={() => setFocused(minutes)}
            onClick={() => !props.isDisabled(minutes) && props.onSelect(minutes)}
          >
            {text(minutes)}
          </button>
        )}
      </For>
    </div>
  );
};
