export type EditableItemId = string | number;

export interface EditableItem {
  id: EditableItemId;
  text: string;
  /** A level option value; string options use their text as the value. */
  level?: string;
  /** 1–`maxWeight`, when `weighted`. */
  weight?: number;
}

export type EditableReorder = 'drag' | 'buttons';
