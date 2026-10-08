import type { JSX } from 'solid-js';

export interface ComparisonItem {
  id: string;
  label: string;
  description?: string;
  /** Initials / <img>; defaults to initials of label. */
  avatar?: JSX.Element;
  /** Series colour; defaults to --dv-N in order (same as RadarChart). */
  color?: string;
  /** Headline score shown in the column header. */
  score?: JSX.Element;
  /** Radar values keyed by axis key, 0–100. */
  scores?: Record<string, number>;
}

export type ComparisonCell = string | number | null;

export interface ComparisonRow {
  label: string;
  hint?: string;
  values: ComparisonCell[];
  /** Star the best value(s) — numeric rows only; ties for everyone are not starred. */
  best?: 'max' | 'min';
  format?: (v: ComparisonCell) => JSX.Element;
}

/** Indexes of the best numeric values in a row; empty when not comparable or when every value ties. */
export const bestIndexes = (values: ComparisonCell[], best: ComparisonRow['best']): number[] => {
  if (!best) return [];
  const numbers = values.map((v) => (typeof v === 'number' ? v : parseFloat(v ?? '')));
  if (numbers.some((n) => !Number.isFinite(n))) return [];
  const target = best === 'min' ? Math.min(...numbers) : Math.max(...numbers);
  const hits = numbers.flatMap((n, i) => (n === target ? [i] : []));
  return hits.length === numbers.length ? [] : hits;
};
