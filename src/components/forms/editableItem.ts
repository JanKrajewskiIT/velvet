export type EditableItemId = string | number;

export interface EditableItem {
  id: EditableItemId;
  text: string;
  /** One of `levels`, when `levels` is set. */
  level?: string;
  /** 1–`maxWeight`, when `weighted`. */
  weight?: number;
}

export type EditableReorder = 'drag' | 'buttons';
