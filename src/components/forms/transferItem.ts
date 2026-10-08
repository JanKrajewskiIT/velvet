import type { JSX } from 'solid-js';

export interface TransferItem {
  value: string;
  label: JSX.Element;
  description?: string;
  /** Right-aligned secondary text (level, count, team). */
  meta?: JSX.Element;
  /** Initials / <img> in a round lead slot. */
  avatar?: JSX.Element;
  /** Velvet icon name in a square lead slot. */
  icon?: string;
  /** Source list is grouped by this (sticky group headers). */
  group?: string;
  /** Extra search text that is not shown. */
  keywords?: string;
  disabled?: boolean;
}

export type TransferSide = 'left' | 'right';

export interface TransferRowState {
  query: string;
  selected: boolean;
}

const DIACRITICS = /[̀-ͯ]/gu;

export const normalizeSearch = (text: string): string => text.toLowerCase().normalize('NFD').replace(DIACRITICS, '');

const isText = (value: unknown): value is string => typeof value === 'string' && value !== '';

export const searchTextOf = (item: TransferItem): string =>
  [item.label, item.description, item.meta, item.group, item.keywords].filter(isText).join(' ');
