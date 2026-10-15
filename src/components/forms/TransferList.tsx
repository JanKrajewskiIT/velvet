import { createMemo, createSignal, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { type TransferItem, type TransferRowState, type TransferSide } from './transferItem';
import styles from './TransferList.module.css';
import { TransferPanel } from './TransferPanel';

export interface TransferListProps {
  items: TransferItem[];
  /** Ordered values of the right list. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** @default localized ['Available', 'Selected'] */
  titles?: [string, string];
  /** List height in px. @default 280 */
  height?: number;
  /** Accessible group name. @default localized "Transfer list" */
  label?: string;
  /** @default true */
  searchable?: boolean;
  /** @default localized ['Search…', 'Search selected…'] */
  searchPlaceholder?: [string, string];
  /** Right list can be reordered (drag or Alt+↑/↓). @default false */
  orderable?: boolean;
  /** Max items in the right list — shows a meter, blocks adding past it. */
  max?: number;
  /** Group the source list by item.group. @default true */
  groupBy?: boolean;
  /** @default localized ['Everything has been added', 'Nothing selected yet — pick from the left'] */
  emptyText?: [JSX.Element, JSX.Element];
  /** Footer move-button labels. @default localized ['Add', 'Remove'] */
  moveLabels?: [string, string];
  /** Custom row body (checkbox + grip stay). */
  renderItem?: (item: TransferItem, state: TransferRowState) => JSX.Element;
  class?: string;
}

const EMPTY_MARKS: ReadonlySet<string> = new Set();

const insertAt = (list: readonly string[], values: readonly string[], before: string | undefined): string[] => {
  const at = before === undefined ? -1 : list.indexOf(before);
  return at < 0 ? [...list, ...values] : [...list.slice(0, at), ...values, ...list.slice(at)];
};

/**
 * Pick an ordered subset from a long pool (required skills, team members, permissions, columns). The value is the ordered
 * array of values in the right list. Per-panel search with match highlight · grouped source list · click / Shift-click range / ⌘A select ·
 * double-click or Enter moves · drag items between panels · orderable: drag within the right list or Alt+↑/↓ · optional max with meter.
 * Duplicate values are reported and block transfer. Stacks vertically under 640px.
 */
export const TransferList = (props: TransferListProps) => {
  const p = mergeProps(
    { height: 280, searchable: true, orderable: false, groupBy: true } satisfies Partial<TransferListProps>,
    props,
  );
  const translate = useTranslate();
  const titles = (): [string, string] =>
    p.titles ?? [
      translate('velvet.forms.transferList.availableTitle'),
      translate('velvet.forms.transferList.selectedTitle'),
    ];
  const searchPlaceholder = (): [string, string] =>
    p.searchPlaceholder ?? [
      translate('velvet.forms.transferList.searchAvailablePlaceholder'),
      translate('velvet.forms.transferList.searchSelectedPlaceholder'),
    ];
  const emptyText = (): [JSX.Element, JSX.Element] =>
    p.emptyText ?? [
      translate('velvet.forms.transferList.emptyAvailable'),
      translate('velvet.forms.transferList.emptySelected'),
    ];
  const moveLabels = (): [string, string] =>
    p.moveLabels ?? [translate('velvet.common.add'), translate('velvet.common.remove')];
  const [chosen, setChosen] = createControllable<string[]>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? [],
    onChange: (next) => p.onValueChange?.(next),
  });
  const [markedLeft, setMarkedLeft] = createSignal<ReadonlySet<string>>(EMPTY_MARKS);
  const [markedRight, setMarkedRight] = createSignal<ReadonlySet<string>>(EMPTY_MARKS);
  const [queryLeft, setQueryLeft] = createSignal('');
  const [queryRight, setQueryRight] = createSignal('');
  const [announcement, setAnnouncement] = createSignal('');

  const byValue = createMemo(() => new Map(p.items.map((item) => [item.value, item])));
  const hasDuplicates = () => p.items.length !== byValue().size;
  const left = createMemo(() => {
    const available = p.items.filter((item) => !chosen().includes(item.value));
    return p.groupBy ? [...available].sort((a, b) => (a.group ?? '').localeCompare(b.group ?? '')) : available;
  });
  const right = createMemo(() => chosen().flatMap((value) => byValue().get(value) ?? []));
  const isFull = () => p.max != null && right().length >= p.max;
  const movable = (value: string): boolean => !byValue().get(value)?.disabled && byValue().has(value);

  const commit = (next: string[], message: string) => {
    if (hasDuplicates()) return;
    setChosen(next);
    setAnnouncement(message);
  };
  const unmark = (marks: ReadonlySet<string>, values: readonly string[]): ReadonlySet<string> =>
    new Set([...marks].filter((value) => !values.includes(value)));

  const add = (values: string[], before?: string) => {
    let accepted = values.filter((value) => !chosen().includes(value) && movable(value));
    if (p.max != null) accepted = accepted.slice(0, Math.max(0, p.max - chosen().length));
    if (!accepted.length) return;
    commit(
      insertAt(chosen(), accepted, before),
      translate('velvet.forms.transferList.itemsAdded', { count: accepted.length, title: titles()[1] }),
    );
    setMarkedLeft(unmark(markedLeft(), accepted));
  };
  const remove = (values: string[]) => {
    const accepted = values.filter(movable);
    if (!accepted.length) return;
    commit(
      chosen().filter((value) => !accepted.includes(value)),
      translate('velvet.forms.transferList.itemsRemoved', { count: accepted.length, title: titles()[0] }),
    );
    setMarkedRight(unmark(markedRight(), accepted));
  };
  const reorder = (value: string, direction: 1 | -1) => {
    const from = chosen().indexOf(value);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= chosen().length) return;
    const next = [...chosen()];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    commit(next, translate('velvet.forms.transferList.movedToPosition', { position: to + 1 }));
  };
  const dropInto = (side: TransferSide) => (from: TransferSide, values: string[], before?: string) => {
    if (side === 'right' && from === 'left') add(values, before);
    else if (side === 'left' && from === 'right') remove(values);
    else if (side === 'right' && from === 'right' && p.orderable) {
      const rest = chosen().filter((value) => !values.includes(value));
      commit(insertAt(rest, values, before), translate('velvet.forms.transferList.reordered'));
    }
  };

  return (
    <div
      class={cx(styles.xfer, p.class)}
      role="group"
      aria-label={p.label ?? translate('velvet.forms.transferList.label')}
    >
      <Show when={hasDuplicates()}>
        <Text as="div" variant="body-sm" tone="inherit" class={styles.xferPartErr} role="alert">
          <Glyph name="alert-circle" />
          {translate('velvet.forms.transferList.duplicateValues')}
        </Text>
      </Show>
      <div class={styles.xferPartGrid}>
        <TransferPanel
          side="left"
          items={left()}
          labels={{
            title: titles()[0],
            moveLabel: moveLabels()[0],
            searchPlaceholder: searchPlaceholder()[0],
            empty: emptyText()[0],
          }}
          query={queryLeft()}
          onQueryChange={setQueryLeft}
          marked={markedLeft()}
          onMarkedChange={setMarkedLeft}
          onMove={add}
          onDropIn={dropInto('left')}
          searchable={p.searchable}
          groupBy={p.groupBy}
          height={p.height}
          limitHit={isFull()}
          renderItem={p.renderItem}
        />
        <div class={styles.xferPartCtrl} aria-hidden="true">
          <Glyph name="chevrons-right" />
        </div>
        <TransferPanel
          side="right"
          items={right()}
          labels={{
            title: titles()[1],
            moveLabel: moveLabels()[1],
            searchPlaceholder: searchPlaceholder()[1],
            empty: emptyText()[1],
          }}
          query={queryRight()}
          onQueryChange={setQueryRight}
          marked={markedRight()}
          onMarkedChange={setMarkedRight}
          onMove={remove}
          onDropIn={dropInto('right')}
          onReorder={p.orderable ? reorder : undefined}
          searchable={p.searchable}
          groupBy={false}
          height={p.height}
          limitHit={isFull()}
          renderItem={p.renderItem}
        />
      </div>
      <Show when={p.max}>
        {(max) => (
          <div
            class={cx(typographyClass('caption'), styles.xferPartLimit, isFull() && styles.xferPartLimitVariantFull)}
          >
            <Meter size="sm" tone={isFull() ? 'warning' : undefined} value={right().length} max={max()} />
            <Text as="span" variant="caption" tone="inherit">
              {translate(
                isFull() ? 'velvet.forms.transferList.limitReached' : 'velvet.forms.transferList.limitProgress',
                { count: right().length, max: max() },
              )}
            </Text>
          </div>
        )}
      </Show>
      <VisuallyHidden aria-live="polite">{announcement()}</VisuallyHidden>
    </div>
  );
};
