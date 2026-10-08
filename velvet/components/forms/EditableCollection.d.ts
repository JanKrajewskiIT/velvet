import * as React from 'react';
export interface EditableItem { id: string | number; text: string; /** One of levels, when levels is set */ level?: string; /** 1–maxWeight, when weighted */ weight?: number }
/** Repeatable editable rows — skills with a level, job requirements, checklist, agenda. Each row: drag grip (or ↑↓ on the focused grip) · always-visible text input · optional level select · optional importance stars · delete. Empty rows show "can't be empty" after blur. Dashed full-width Add focuses the new row. Header with title + live count. */
export interface EditableCollectionProps {
  items?: EditableItem[];
  defaultItems?: EditableItem[];
  onItemsChange?: (items: EditableItem[]) => void;
  /** Header title */
  title?: React.ReactNode;
  /** Live item count in the header. @default true when title is set */
  showCount?: boolean;
  /** Count text, e.g. n => n + ' pozycje'. @default 'N items' */
  countLabel?: (n: number) => React.ReactNode;
  /** Per-row select (e.g. Basic / Intermediate / Advanced / Expert) */
  levels?: string[];
  /** @default 'Level' */
  levelLabel?: string;
  /** Importance stars per row. @default false */
  weighted?: boolean;
  /** @default 5 */
  maxWeight?: number;
  /** drag = grip handle (+ ↑↓ keys on it) · buttons = up / down icon buttons. @default 'drag' */
  reorder?: 'drag' | 'buttons';
  /** Flag empty rows after blur. @default true */
  required?: boolean;
  requiredText?: string;
  /** Input placeholder. @default 'Name' */
  placeholder?: string;
  /** @default 'Add item' */
  addLabel?: string;
  /** Text of a freshly added row. @default '' */
  newItemText?: string;
  emptyText?: React.ReactNode;
  /** Hides Add at this length */
  maxItems?: number;
  /** Accessible list name */
  label?: string;
  className?: string;
}
export declare function EditableCollection(props: EditableCollectionProps): JSX.Element;
