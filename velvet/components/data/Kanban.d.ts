import * as React from 'react';
export interface KanbanColumn { id: string; title: string; /** Status dot colour — e.g. 'var(--dv-2)' */ color?: string; /** WIP limit — count turns warning when exceeded */ limit?: number }
export interface KanbanCard { id: string | number; column: string; title?: React.ReactNode; tag?: string; tagTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'; meta?: React.ReactNode; assignee?: React.ReactNode; [key: string]: any }
/** Column task board. Drag & drop with a drop-position ghost, or keyboard: ↑↓ focus cards, Ctrl/⌘/Alt + ←→ move between columns, + ↑↓ reorder. Moves are announced. Controlled: you own cards. */
export interface KanbanProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardsChange?: (cards: KanbanCard[]) => void;
  onCardClick?: (card: KanbanCard) => void;
  /** Replace the default card body */
  renderCard?: (card: KanbanCard) => React.ReactNode;
  /** Shows + in each column header */
  onAddCard?: (columnId: string) => void;
  className?: string;
}
export declare function Kanban(props: KanbanProps): JSX.Element;
