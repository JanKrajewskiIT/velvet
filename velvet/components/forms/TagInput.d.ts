import * as React from 'react';
/** Free-text tags inside a field. Enter or comma adds, Backspace on empty removes the last, pasted comma/newline lists split, duplicates (case-insensitive) flash instead of adding. */
export interface TagInputProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** @default 'Add…' */
  placeholder?: string;
  /** Cap + "n/max" counter */
  max?: number;
  /** Keys that commit the current text. @default ['Enter', ','] */
  separators?: string[];
  /** Normalise each tag before adding — e.g. s => s.toLowerCase() */
  transform?: (tag: string) => string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function TagInput(props: TagInputProps): JSX.Element;
