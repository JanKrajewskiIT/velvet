import { type Accessor, createMemo, type JSX, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { clamp } from '../../utils/math';
import type { ColumnPin, ColumnState, ManagedColumn } from './columnManagerTypes';
import { type Zone, type ZoneKey, zoneOf, ZONES } from './columnZones';

export interface ColumnModelOptions {
  columns: Accessor<ManagedColumn[]>;
  value: Accessor<ColumnState[] | undefined>;
  defaultValue: Accessor<ColumnState[] | undefined>;
  onChange: (state: ColumnState[]) => void;
  pinRight: Accessor<boolean>;
  maxPinned: Accessor<number | undefined>;
  announce: (message: string) => void;
}

export interface ColumnModel {
  state: Accessor<ColumnState[]>;
  zones: Accessor<Zone[]>;
  inZone: (pin: ColumnPin | null) => ColumnState[];
  pinnedCount: () => number;
  limitReached: () => boolean;
  labelOf: (key: string) => JSX.Element;
  isLocked: (key: string) => boolean;
  nameOf: (key: string) => string;
  moveTo: (key: string, pin: ColumnPin | null, index?: number) => void;
  togglePin: (c: ColumnState) => void;
  toggleVisible: (c: ColumnState) => void;
  reset: () => void;
}

const initialState = (columns: ManagedColumn[]): ColumnState[] =>
  columns.map((c) => ({ key: c.key, visible: c.visible !== false, pin: c.pin ?? null }));

export const createColumnModel = (options: ColumnModelOptions): ColumnModel => {
  const translate = useTranslate();
  const initial = untrack(() => initialState(options.columns()));
  const [state, setState] = createControllable<ColumnState[]>({
    value: options.value,
    defaultValue: options.defaultValue() ?? initial,
    onChange: options.onChange,
  });

  const zones = createMemo(() =>
    ZONES.filter((z) => z.pin !== 'right' || options.pinRight() || state().some((c) => c.pin === 'right')),
  );
  const inZone = (pin: ColumnPin | null) => state().filter((c) => c.pin === pin);
  const pinnedCount = () => state().filter((c) => c.pin).length;
  const limitReached = () => {
    const max = options.maxPinned();
    return max != null && pinnedCount() >= max;
  };
  const labelOf = (key: string) => options.columns().find((c) => c.key === key)?.label ?? key;
  const isLocked = (key: string) => !!options.columns().find((c) => c.key === key)?.locked;
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
      options.announce(translate('velvet.data.columnManager.unpinned', { name: nameOf(c.key) }));
    } else if (limitReached()) {
      options.announce(translate('velvet.data.columnManager.pinLimit', { count: options.maxPinned() }));
    } else {
      moveTo(c.key, 'left');
      options.announce(translate('velvet.data.columnManager.pinnedLeft', { name: nameOf(c.key) }));
    }
  };
  const toggleVisible = (c: ColumnState) =>
    setState(state().map((x) => (x.key === c.key ? { ...x, visible: !x.visible } : x)));
  const reset = () => setState(initial);

  return {
    state,
    zones,
    inZone,
    pinnedCount,
    limitReached,
    labelOf,
    isLocked,
    nameOf,
    moveTo,
    togglePin,
    toggleVisible,
    reset,
  };
};
