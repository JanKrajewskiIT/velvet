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
  /** Synchronous or async acknowledgement; false declines the move. Return values otherwise remain consumer-owned. */
  onCardsChange?: (cards: KanbanCard[], move: KanbanMove, signal: AbortSignal) => unknown;
  canMove?: (card: KanbanCard, destination: KanbanColumn, index: number) => boolean;
  enforceLimits?: boolean;
  disabled?: boolean;
  dataKey?: string | number;
  onMoveError?: (error: unknown) => void;
  moveErrorText?: string;
  onCardClick?: (card: KanbanCard) => void;
  /** Replace the default card body. */
  renderCard?: (card: KanbanCard) => JSX.Element;
  /** Shows + in each column header. */
  onAddCard?: (columnId: string) => void;
  class?: string;
}

export interface KanbanMove {
  id: KanbanCard['id'];
  from: string;
  to: string;
  index: number;
}
