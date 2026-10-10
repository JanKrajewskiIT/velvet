import type { JSX } from 'solid-js';

import type { StatusTone } from '../../utils/tone';

export interface KanbanColumn {
  id: string;
  title: string;
  /** Status dot colour — e.g. `'var(--dv-2)'`. */
  color?: string;
  /** WIP limit — count turns warning when exceeded. */
  limit?: number;
}

export interface KanbanCard {
  id: string | number;
  column: string;
  title?: JSX.Element;
  tag?: string;
  tagTone?: StatusTone;
  meta?: JSX.Element;
  assignee?: JSX.Element;
  [key: string]: unknown;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardsChange?: (cards: KanbanCard[]) => void;
  onCardClick?: (card: KanbanCard) => void;
  /** Replace the default card body. */
  renderCard?: (card: KanbanCard) => JSX.Element;
  /** Shows + in each column header. */
  onAddCard?: (columnId: string) => void;
  class?: string;
}
