import type { I18nKey } from '@jankrajewskiit/i18n';

import type { ColumnPin } from './columnManagerTypes';

export type ZoneKey = 'left' | 'mid' | 'right';

export interface Zone {
  pin: ColumnPin | null;
  zone: ZoneKey;
  labelKey: I18nKey;
  movedKey: I18nKey;
}

export const ZONES: Zone[] = [
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

export const zoneOf = (pin: ColumnPin | null): ZoneKey => pin ?? 'mid';
