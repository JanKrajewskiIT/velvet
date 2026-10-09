import { useTranslate } from '../../i18n/useTranslate';
import type { ColumnState } from './columnManagerTypes';
import type { ColumnModel } from './createColumnModel';

export interface ColumnKeyboardOptions {
  model: ColumnModel;
  root: () => HTMLElement;
  announce: (message: string) => void;
}

export const createColumnKeyboard = (options: ColumnKeyboardOptions) => {
  const translate = useTranslate();
  const { model } = options;

  const focusGrip = (key: string) =>
    requestAnimationFrame(() =>
      options
        .root()
        .querySelector<HTMLElement>(`[data-grip="${CSS.escape(key)}"]`)
        ?.focus(),
    );

  return (e: KeyboardEvent, c: ColumnState) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const list = model.inZone(c.pin);
    const index = list.findIndex((x) => x.key === c.key);
    const step = e.key === 'ArrowUp' ? -1 : 1;
    const to = index + step;
    const neighbour = list[to];
    if (neighbour) {
      if (model.isLocked(neighbour.key)) return;
      model.moveTo(c.key, c.pin, to);
      options.announce(
        translate('velvet.data.columnManager.movedToPosition', { name: model.nameOf(c.key), position: to + 1 }),
      );
    } else {
      const zones = model.zones();
      const zoneIndex = zones.findIndex((z) => z.pin === c.pin);
      const next = zones[zoneIndex + step];
      if (next && !(next.pin && !c.pin && model.limitReached())) {
        model.moveTo(c.key, next.pin, step < 0 ? undefined : 0);
        options.announce(translate(next.movedKey, { name: model.nameOf(c.key) }));
      }
    }
    focusGrip(c.key);
  };
};
