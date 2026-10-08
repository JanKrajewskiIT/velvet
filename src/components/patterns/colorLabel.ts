export interface ColorLabel {
  id: string;
  name: string;
  color: string;
  /** Items using it — shown and mentioned on delete */
  count?: number;
}

const SERIES_COUNT = 8;

/** The data-viz series palette, in order. */
export const LABEL_COLORS: string[] = Array.from({ length: SERIES_COUNT }, (_, i) => `var(--dv-${i + 1})`);

/** Case- and diacritic-insensitive form used to match label names. */
export const normalizeLabelText = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '');

/** Colours are cycled in order as labels are added. */
export const nextLabelColor = (colors: readonly string[], labelCount: number): string =>
  colors[labelCount % colors.length] ?? LABEL_COLORS[0] ?? '';
