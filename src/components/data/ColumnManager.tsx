import type { I18nKey } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, type JSX, mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { SearchInput } from '../forms/SearchInput';
import { Switch } from '../forms/Switch';
import { Count } from '../primitives/Count';
import { Handle } from '../primitives/Handle';
import { SectionLabel } from '../primitives/SectionLabel';
import { clamp } from './rowData';

export type ColumnPin = 'left' | 'right';

export interface ManagedColumn {
  key: string;
  label: JSX.Element;
  /** Start hidden when false. @default true */
  visible?: boolean;
  /** Start pinned. */
  pin?: ColumnPin;
  /** Can't be hidden, moved or unpinned (e.g. Name). */
  locked?: boolean;
}

export interface ColumnState {
  key: string;
  visible: boolean;
  pin: ColumnPin | null;
}

export interface ColumnManagerProps {
  /** Source columns in their default order. */
  columns: ManagedColumn[];
  value?: ColumnState[];
  defaultValue?: ColumnState[];
  onChange?: (state: ColumnState[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (state: ColumnState[]) => void;
  /** @default localized "Columns" */
  title?: string;
  /** Offer a "Pinned right" section (actions, totals). @default false */
  pinRight?: boolean;
  /** Cap on pinned columns — pins beyond it are disabled with a hint. */
  maxPinned?: number;
  /** Defaults to on when there are more than 8 columns. */
  searchable?: boolean;
  class?: string;
}

type ZoneKey = 'left' | 'mid' | 'right';

interface Zone {
  pin: ColumnPin | null;
  zone: ZoneKey;
  labelKey: I18nKey;
  movedKey: I18nKey;
}

interface DropTarget {
  key: string | null;
  pin: ColumnPin | null;
  pos: 'above' | 'below';
}

const SEARCH_MIN_COLUMNS = 8;

const ZONES: Zone[] = [
  {
    pin: 'left',
    zone: 'left',
    labelKey: 'velvet.data.columnManager.zoneLeft',
    movedKey: 'velvet.data.columnManager.movedToLeft',
  },
  {
    pin: null,
    zone: 'mid',
    labelKey: 'velvet.data.columnManager.zoneMid',
    movedKey: 'velvet.data.columnManager.movedToMid',
  },
  {
    pin: 'right',
    zone: 'right',
    labelKey: 'velvet.data.columnManager.zoneRight',
    movedKey: 'velvet.data.columnManager.movedToRight',
  },
];

const zoneOf = (pin: ColumnPin | null): ZoneKey => pin ?? 'mid';

const initialState = (columns: ManagedColumn[]): ColumnState[] =>
  columns.map((c) => ({ key: c.key, visible: c.visible !== false, pin: c.pin ?? null }));

const zoneCount = (pin: ColumnPin | null, count: number): JSX.Element => {
  if (!pin || count === 0) return undefined;
  return <Count value={count} size="sm" tone="soft" />;
};

/**
 * Table column settings: visibility (switch), order (drag the grip, or focus it and press ↑/↓ — moves cross section
 * boundaries), and freezing (pin button). Any number of columns can be pinned; sections are Pinned left · Columns ·
 * Pinned right (right appears with `pinRight` or when a column is already pinned right). Search appears past 8 columns.
 * Usually inside a Popover opened from a "Columns" button in the Table toolbar. Feed Table with `ApplyColumns(columns, state)`.
 */
export const ColumnManager = (props: ColumnManagerProps): JSX.Element => {
  const p = mergeProps({ pinRight: false } satisfies Partial<ColumnManagerProps>, props);
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.data.columnManager.title');
  const initial = untrack(() => initialState(p.columns));
  const [state, setState] = createControllable<ColumnState[]>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? initial,
    onChange: (next) => (p.onChange ?? p.onValueChange)?.(next),
  });
  const [query, setQuery] = createSignal('');
  const [dragKey, setDragKey] = createSignal<string | null>(null);
  const [over, setOver] = createSignal<DropTarget | null>(null);
  const [message, setMessage] = createSignal('');
  let root!: HTMLDivElement;

  const showSearch = () => p.searchable ?? p.columns.length > SEARCH_MIN_COLUMNS;
  const zones = createMemo(() =>
    ZONES.filter((z) => z.pin !== 'right' || p.pinRight || state().some((c) => c.pin === 'right')),
  );
  const inZone = (pin: ColumnPin | null) => state().filter((c) => c.pin === pin);
  const pinnedCount = () => state().filter((c) => c.pin).length;
  const limitReached = () => p.maxPinned != null && pinnedCount() >= p.maxPinned;
  const labelOf = (key: string) => p.columns.find((c) => c.key === key)?.label ?? key;
  const isLocked = (key: string) => !!p.columns.find((c) => c.key === key)?.locked;
  const nameOf = (key: string) => {
    const label = labelOf(key);
    return typeof label === 'string' ? label : key;
  };

  const moveTo = (key: string, pin: ColumnPin | null, index?: number) => {
    const from = state().find((c) => c.key === key);
    if (!from) return;
    const without = (pinZone: ColumnPin | null) => inZone(pinZone).filter((c) => c.key !== key);
    const lists: Record<ZoneKey, ColumnState[]> = {
      left: without('left'),
      mid: without(null),
      right: without('right'),
    };
    const target = lists[zoneOf(pin)];
    target.splice(index == null ? target.length : clamp(index, 0, target.length), 0, { ...from, pin });
    setState([...lists.left, ...lists.mid, ...lists.right]);
  };

  const togglePin = (c: ColumnState) => {
    if (c.pin) {
      moveTo(c.key, null, 0);
      setMessage(translate('velvet.data.columnManager.unpinned', { name: nameOf(c.key) }));
    } else if (limitReached()) {
      setMessage(translate('velvet.data.columnManager.pinLimit', { count: p.maxPinned }));
    } else {
      moveTo(c.key, 'left');
      setMessage(translate('velvet.data.columnManager.pinnedLeft', { name: nameOf(c.key) }));
    }
  };
  const toggleVisible = (c: ColumnState) =>
    setState(state().map((x) => (x.key === c.key ? { ...x, visible: !x.visible } : x)));

  const focusGrip = (key: string) =>
    requestAnimationFrame(() => root.querySelector<HTMLElement>(`[data-grip="${CSS.escape(key)}"]`)?.focus());

  const keyMove = (e: KeyboardEvent, c: ColumnState) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const list = inZone(c.pin);
    const index = list.findIndex((x) => x.key === c.key);
    const step = e.key === 'ArrowUp' ? -1 : 1;
    const to = index + step;
    const neighbour = list[to];
    if (neighbour) {
      if (isLocked(neighbour.key)) return;
      moveTo(c.key, c.pin, to);
      setMessage(translate('velvet.data.columnManager.movedToPosition', { name: nameOf(c.key), position: to + 1 }));
    } else {
      const zoneIndex = zones().findIndex((z) => z.pin === c.pin);
      const next = zones()[zoneIndex + step];
      if (next && !(next.pin && !c.pin && limitReached())) {
        moveTo(c.key, next.pin, step < 0 ? undefined : 0);
        setMessage(translate(next.movedKey, { name: nameOf(c.key) }));
      }
    }
    focusGrip(c.key);
  };

  const endDrag = () => {
    setDragKey(null);
    setOver(null);
  };

  const dropOnItem = (c: ColumnState) => {
    const dragged = dragKey();
    if (dragged && over()) {
      const list = inZone(c.pin).filter((x) => x.key !== dragged);
      let index = list.findIndex((x) => x.key === c.key);
      if (over()?.pos === 'below') index++;
      const draggedPinned = !!state().find((x) => x.key === dragged)?.pin;
      if (!(c.pin && !draggedPinned && limitReached())) moveTo(dragged, c.pin, index);
    }
    endDrag();
  };

  const visibleCount = () => state().filter((c) => c.visible).length;
  const pinnedText = () => {
    if (!pinnedCount()) return translate('velvet.data.columnManager.nothingPinned');
    return p.maxPinned != null
      ? translate('velvet.data.columnManager.pinnedOfMax', { count: pinnedCount(), max: p.maxPinned })
      : translate('velvet.data.columnManager.pinnedCount', { count: pinnedCount() });
  };
  const needle = () => query().trim().toLowerCase();
  const keysFor = (pin: ColumnPin | null) =>
    inZone(pin)
      .filter((c) => !needle() || nameOf(c.key).toLowerCase().includes(needle()))
      .map((c) => c.key);

  const reset = () => {
    setState(initial);
    setQuery('');
    setMessage(translate('velvet.data.columnManager.resetAnnouncement'));
  };

  const item = (key: string, pin: ColumnPin | null) => {
    const placeholder: ColumnState = { key, visible: true, pin };
    const column = () => state().find((x) => x.key === key) ?? placeholder;
    const locked = () => isLocked(column().key);
    const atMax = () => !column().pin && limitReached();
    const dropClass = () => {
      const target = over();
      return target?.key === column().key && dragKey() && dragKey() !== column().key
        ? `vui-colman__item--${target.pos}`
        : false;
    };
    return (
      <li
        class={cx(
          'vui-colman__item',
          !column().visible && 'vui-colman__item--off',
          dragKey() === column().key && 'vui-colman__item--drag',
          dropClass(),
        )}
        draggable={!locked()}
        onDragStart={(e) => {
          setDragKey(column().key);
          if (!e.dataTransfer) return;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', column().key);
        }}
        onDragOver={(e) => {
          if (!dragKey()) return;
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setOver({ key: column().key, pin, pos: e.clientY < rect.top + rect.height / 2 ? 'above' : 'below' });
        }}
        onDragEnd={endDrag}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dropOnItem(column());
        }}
      >
        <Handle
          data-grip={column().key}
          class="vui-colman__grip"
          icon={locked() ? 'lock' : 'grip-vertical'}
          disabled={locked()}
          label={translate('velvet.data.columnManager.reorder', { name: nameOf(column().key) })}
          onKeyDown={(e) => keyMove(e, column())}
        />
        <span class="vui-colman__name">{labelOf(column().key)}</span>
        <IconButton
          size="xs"
          icon="pin"
          label={translate(
            column().pin ? 'velvet.data.columnManager.unpinLabel' : 'velvet.data.columnManager.pinLabel',
            { name: nameOf(column().key) },
          )}
          title={translate(
            atMax()
              ? 'velvet.data.columnManager.pinLimitReached'
              : column().pin
                ? 'velvet.data.columnManager.unpin'
                : 'velvet.data.columnManager.pinLeft',
          )}
          class={cx('vui-colman__pin', column().pin && 'vui-colman__pin--on')}
          disabled={locked() || atMax()}
          aria-pressed={!!column().pin}
          onClick={() => togglePin(column())}
        />
        <Switch
          size="sm"
          aria-label={translate('velvet.data.columnManager.showColumn', { name: nameOf(column().key) })}
          checked={column().visible}
          disabled={locked()}
          onChange={() => toggleVisible(column())}
        />
      </li>
    );
  };

  return (
    <div ref={root} class={cx('vui-colman', p.class)}>
      <div class="vui-colman__head">
        <span class="vui-colman__title">{title()}</span>
        <Button variant="link" size="xs" onClick={reset}>
          {translate('velvet.data.columnManager.resetLabel')}
        </Button>
      </div>
      <Show when={showSearch()}>
        <SearchInput
          size="sm"
          class="vui-colman__search"
          placeholder={translate('velvet.data.columnManager.searchPlaceholder')}
          aria-label={translate('velvet.data.columnManager.searchLabel')}
          value={query()}
          onValueChange={setQuery}
        />
      </Show>
      <div class="vui-colman__body">
        <For each={zones()}>
          {(zone) => {
            const all = () => inZone(zone.pin);
            const rows = () => keysFor(zone.pin);
            const emptyDropActive = () => !!dragKey() && over()?.pin === zone.pin;
            return (
              <Show when={!needle() || rows().length > 0}>
                <section
                  class={cx('vui-colman__zone', zone.pin && 'vui-colman__zone--pinned')}
                  aria-label={translate(zone.labelKey)}
                >
                  <SectionLabel class="vui-colman__sec" end={zoneCount(zone.pin, all().length)}>
                    {translate(zone.labelKey)}
                  </SectionLabel>
                  <ul
                    class="vui-colman__list"
                    onDragOver={(e) => {
                      if (!dragKey() || all().length) return;
                      e.preventDefault();
                      setOver({ key: null, pin: zone.pin, pos: 'below' });
                    }}
                    onDrop={(e) => {
                      const dragged = dragKey();
                      if (!dragged || all().length) return;
                      e.preventDefault();
                      moveTo(dragged, zone.pin, 0);
                      endDrag();
                    }}
                  >
                    <For each={rows()}>{(key) => item(key, zone.pin)}</For>
                    <Show when={all().length === 0}>
                      <li class={cx('vui-colman__drop', emptyDropActive() && 'vui-colman__drop--on')}>
                        {translate(
                          zone.pin ? 'velvet.data.columnManager.dropHint' : 'velvet.data.columnManager.allPinned',
                        )}
                      </li>
                    </Show>
                  </ul>
                </section>
              </Show>
            );
          }}
        </For>
      </div>
      <div class="vui-colman__foot">
        <span>
          {translate('velvet.data.columnManager.visibleCount', { visible: visibleCount(), total: state().length })}
        </span>
        <span>{pinnedText()}</span>
      </div>
      <span class="vui-sr-only" aria-live="polite">
        {message()}
      </span>
    </div>
  );
};
