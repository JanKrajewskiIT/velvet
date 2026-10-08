import { createMemo, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Avatar } from '../data/Avatar';
import { CloseButton } from '../primitives/CloseButton';
import { Glyph } from '../primitives/Glyph';
import { seriesColor } from './chartScale';
import type { ComparisonItem } from './comparison';

export interface ComparisonBarProps {
  items: ComparisonItem[];
  /** @default 2 */
  min?: number;
  /** @default 4 */
  max?: number;
  onRemove?: (id: string) => void;
  onClear?: () => void;
  onCompare?: () => void;
  /** @default localized "Compare" */
  compareLabel?: string;
  /** Singular / plural noun for the button. @default localized "item" / "items" */
  noun?: [string, string];
  /** Fixed to the viewport bottom, centred. @default true */
  floating?: boolean;
  class?: string;
}

/** Selection tray for "pick 2–4 things, then compare" (candidates, offers, plans). Slides up from the bottom when something is selected (floating) or sits inline. Shows removable chips, empty slots up to `min`, a live hint and Compare — disabled outside min…max. */
export const ComparisonBar = (props: ComparisonBarProps) => {
  const merged = mergeProps({ min: 2, max: 4, floating: true } satisfies Partial<ComparisonBarProps>, props);
  const translate = useTranslate();
  const compareLabel = () => merged.compareLabel ?? translate('velvet.charts.comparisonBar.compareLabel');

  const count = () => merged.items.length;
  const shown = () => count() > 0;
  const ready = () => count() >= merged.min && count() <= merged.max;
  const over = () => count() > merged.max;
  const emptySlots = createMemo(() =>
    Array.from({ length: Math.max(0, Math.min(merged.max, merged.min) - count()) }, (_, i) => i),
  );
  const hint = () => {
    if (count() < merged.min)
      return translate('velvet.charts.comparisonBar.hintSelectMore', { count: merged.min - count() });
    if (over())
      return translate('velvet.charts.comparisonBar.hintTooMany', { max: merged.max, excess: count() - merged.max });
    return translate('velvet.charts.comparisonBar.hintSelected', { count: count(), max: merged.max });
  };
  const tabIndex = () => (shown() ? 0 : -1);
  const compareText = () => {
    if (!count()) return compareLabel();
    const noun = merged.noun;
    if (noun) return `${compareLabel()} ${count()} ${count() === 1 ? noun[0] : noun[1]}`;
    return translate('velvet.charts.comparisonBar.compareCount', { label: compareLabel(), count: count() });
  };

  return (
    <div
      class={cx('vui-cmpbar', merged.floating && 'vui-cmpbar--floating', shown() && 'vui-cmpbar--shown', merged.class)}
      role="region"
      aria-label={translate('velvet.charts.comparisonBar.regionLabel')}
      aria-hidden={shown() ? undefined : true}
    >
      <div class="vui-cmpbar__items">
        <For each={merged.items}>
          {(item, i) => (
            <span class="vui-cmpbar__chip" style={{ '--c': item.color ?? seriesColor(i()) }}>
              <Avatar size="sm" name={item.label} color="var(--c)" class="vui-cmpbar__av" aria-hidden="true">
                {item.avatar}
              </Avatar>
              <span class="vui-cmpbar__lbl">{item.label}</span>
              <Show when={merged.onRemove}>
                {(remove) => (
                  <CloseButton
                    variant="bare"
                    class="vui-cmpbar__x"
                    label={translate('velvet.charts.comparisonBar.removeLabel', { label: item.label })}
                    tabIndex={tabIndex()}
                    onClick={() => remove()(item.id)}
                  />
                )}
              </Show>
            </span>
          )}
        </For>
        <For each={emptySlots()}>
          {() => (
            <span class="vui-cmpbar__slot" aria-hidden="true">
              <Glyph name="plus" />
            </span>
          )}
        </For>
      </div>
      <span class={cx('vui-cmpbar__hint', over() && 'vui-cmpbar__hint--over')} aria-live="polite">
        {hint()}
      </span>
      <div class="vui-cmpbar__acts">
        <Show when={merged.onClear}>
          {(clear) => (
            <Button variant="ghost" size="sm" tabIndex={tabIndex()} onClick={() => clear()()}>
              {translate('velvet.common.clear')}
            </Button>
          )}
        </Show>
        <Button
          size="sm"
          iconLeft="bar-chart"
          disabled={!ready()}
          tabIndex={tabIndex()}
          onClick={() => merged.onCompare?.()}
        >
          {compareText()}
        </Button>
      </div>
    </div>
  );
};
