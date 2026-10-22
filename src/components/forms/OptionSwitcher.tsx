import { createMemo, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { activeItemKey } from '../../utils/activeItem';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Segmented } from '../primitives/Segmented';
import { SegmentedItem } from '../primitives/SegmentedItem';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './OptionSwitcher.module.css';

const SWITCHER_CLASSES = {
  chips: styles.switcherVariantChips,
  icons: styles.switcherVariantIcons,
  tiles: styles.switcherVariantTiles,
  sm: styles.switcherVariantSm,
} as const;

export interface SwitcherOption {
  value: string;
  label?: JSX.Element;
  /** Glyph name. */
  icon?: string;
  disabled?: boolean;
}

export interface OptionSwitcherProps {
  options: ReadonlyArray<string | SwitcherOption>;
  /** Controlled value. */
  value?: string;
  /** @default the first enabled option */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'track' */
  variant?: 'track' | 'chips' | 'tiles';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Icons only; a string label becomes `aria-label` and `title`. Every option needs an icon and a string label. */
  iconOnly?: boolean;
  /** Accessible group name. */
  label?: string;
  class?: string;
}

const STEP_BY_KEY: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
const ENABLED_RADIOS = '[role="radio"]:not(:disabled)';

const normalizeSwitcherOption = (option: string | SwitcherOption): SwitcherOption =>
  typeof option === 'string' ? { value: option, label: option } : option;

const stringLabel = (option: SwitcherOption): string | undefined =>
  typeof option.label === 'string' ? option.label : undefined;

/** Required single choice among 2–5 options (radiogroup; ←→ move + select). `track` = segmented tool track · `chips` = separate pills · `tiles` = icon above label. Use Tabs when the choice swaps page panels, ChipGroup for multi-select. */
export const OptionSwitcher = (props: OptionSwitcherProps) => {
  const p = mergeProps({ variant: 'track', size: 'md', iconOnly: false } satisfies Partial<OptionSwitcherProps>, props);
  const options = createMemo(() => p.options.map(normalizeSwitcherOption));
  const [current, setCurrent] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue ?? options().find((option) => !option.disabled)?.value ?? '',
    onChange: (value) => p.onValueChange?.(value),
  });
  const tabStop = () =>
    activeItemKey(
      options(),
      current(),
      (option) => option.value,
      (option) => !option.disabled,
    );

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    const step = STEP_BY_KEY[event.key];
    if (step === undefined || event.defaultPrevented) return;
    const enabled = options().filter((option) => !option.disabled);
    const buttons = [...event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_RADIOS)];
    const focused = buttons.findIndex((button) => button.contains(event.target));
    const at = focused < 0 ? enabled.findIndex((option) => option.value === tabStop()) : focused;
    const nextIndex = (at + step + enabled.length) % enabled.length;
    const next = enabled[nextIndex];
    if (!next) return;
    event.preventDefault();
    setCurrent(next.value);
    buttons[nextIndex]?.focus();
  };

  return (
    <Show
      when={p.variant !== 'track'}
      fallback={
        <Segmented
          role="radiogroup"
          aria-label={p.label}
          onKeyDown={onKeyDown}
          size={p.size}
          iconOnly={p.iconOnly}
          class={cx(styles.switcher, p.class)}
        >
          <For each={options()}>
            {(option) => (
              <SegmentedItem
                role="radio"
                selected={current() === option.value}
                tabIndex={tabStop() === option.value ? 0 : -1}
                disabled={option.disabled}
                icon={option.icon}
                aria-label={p.iconOnly ? stringLabel(option) : undefined}
                title={p.iconOnly ? stringLabel(option) : undefined}
                onClick={() => setCurrent(option.value)}
              >
                <Show when={!p.iconOnly}>{option.label}</Show>
              </SegmentedItem>
            )}
          </For>
        </Segmented>
      }
    >
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus roves on the radio options, not on the group */}
      <div
        role="radiogroup"
        aria-label={p.label}
        onKeyDown={onKeyDown}
        class={cx(
          styles.switcher,
          variantClass(SWITCHER_CLASSES, p.variant),
          p.size === 'sm' && styles.switcherVariantSm,
          p.iconOnly && styles.switcherVariantIcons,
          p.class,
        )}
      >
        <For each={options()}>
          {(option) => (
            <button
              type="button"
              role="radio"
              aria-checked={current() === option.value}
              tabIndex={tabStop() === option.value ? 0 : -1}
              disabled={option.disabled}
              aria-label={p.iconOnly ? stringLabel(option) : undefined}
              title={p.iconOnly ? stringLabel(option) : undefined}
              class={cx(
                typographyClass(p.size === 'sm' ? 'label-sm' : 'button-sm'),
                styles.switcherPartOpt,
                current() === option.value && styles.switcherPartOptVariantOn,
              )}
              onClick={() => setCurrent(option.value)}
            >
              <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
              <Show when={!p.iconOnly}>
                <Show when={p.variant === 'tiles'} fallback={option.label}>
                  <Text as="span" variant="label-sm" tone="inherit" class="vui-switcher__tlabel">
                    {option.label}
                  </Text>
                </Show>
              </Show>
            </button>
          )}
        </For>
      </div>
    </Show>
  );
};
