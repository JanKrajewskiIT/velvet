import { pad } from '../../utils/date';

export const formDate = (date: Date): string =>
  Number.isNaN(date.getTime())
    ? ''
    : `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formDateTime = (date: Date): string => (Number.isNaN(date.getTime()) ? '' : date.toISOString());
